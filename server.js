const express = require('express');
const pool = require('./db_connect');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(__dirname));

app.post('/api/getList', async (req, res) => {
    try {
        const { content } = req.body;
        const sql = `
            INSERT INTO todo_list (content)
            VALUES (?)
        `;
       const [result] = await pool.query(sql, [content]);
        
        res.status(201).json({ message: '저장되었습니다.', data: { id: result.insertId, content} });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'DB 조회 중 오류 발생', error });
    }
});
