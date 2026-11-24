
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const crypto = require("crypto");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));

app.get("/health", (req, res) => {
    res.json({
        status: "OK",
        game: "LudoKing"
    });
});

const rooms = new Map();

function createRoomCode() {
    let code;

    do {
        code = crypto.randomBytes(3).toString("hex").toUpperCase();
    } while (rooms.has(code));

    return code;
}

function getRoomInfo(room) {
    return {
        code: room.code,
        players: room.players.map(player => ({
            name: player.name,
            color: player.color
        })),
        maxPlayers: 4
    };
}

io.on("connection", socket => {
    console.log("Player connected:", socket.id);

    socket.on("createRoom", (playerName, callback = () => {}) => {
        const name = String(playerName || "").trim().slice(0, 20);

        if (!name) {
            return callback({ error: "Naam likho." });
        }

        const code = createRoomCode();

        const room = {
            code,
            players: [{
                id: socket.id,
                name,
                color: "Red"
            }]
        };

        rooms.set(code, room);
        socket.join(code);
        socket.data.roomCode = code;

        callback({
            success: true,
            room: getRoomInfo(room)
        });

        io.to(code).emit("roomUpdated", getRoomInfo(room));
    });

    socket.on("joinRoom", (data, callback = () => {}) => {
        const code = String(data?.code || "").trim().toUpperCase();
        const name = String(data?.name || "").trim().slice(0, 20);

        const room = rooms.get(code);

        if (!name) {
            return callback({ error: "Naam likho." });
        }

        if (!room) {
            return callback({ error: "Room nahi mila." });
        }

        if (room.players.length >= 4) {
            return callback({ error: "Room full hai." });
        }

        if (room.players.some(p => p.id === socket.id)) {
            return callback({ error: "Aap pehle se room mein ho." });
        }

        const colors = ["Red", "Blue", "Green", "Yellow"];
        const usedColors = room.players.map(p => p.color);
        const color = colors.find(c => !usedColors.includes(c));

        room.players.push({
            id: socket.id,
            name,
            color
        });

        socket.join(code);
        socket.data.roomCode = code;

        callback({
            success: true,
            room: getRoomInfo(room)
        });

        io.to(code).emit("roomUpdated", getRoomInfo(room));
    });

    socket.on("disconnect", () => {
        const code = socket.data.roomCode;
        if (!code) return;

        const room = rooms.get(code);
        if (!room) return;

        room.players = room.players.filter(p => p.id !== socket.id);

        if (room.players.length === 0) {
            rooms.delete(code);
        } else {
            io.to(code).emit("roomUpdated", getRoomInfo(room));
        }

        console.log("Player disconnected:", socket.id);
    });
});

server.listen(PORT, "0.0.0.0", () => {
    console.log("LudoKing server running on port " + PORT);
});
