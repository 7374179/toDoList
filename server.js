const express = require('express');
const pool = require('./db_connect');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(__dirname));

// CORS 설정: 5500번 포트(프론트엔드)에서 오는 요청을 허용
// app.use((req, res, next) => {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });

app.post('/api/addList', async (req, res) => {
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

app.get('/api/getLists', async (req, res) => {
    try {
        // 아래 order by 작동안함
        const sql = `
            SELECT *
            FROM todo_list
            WHERE is_deleted = '0'
            ORDER BY is_completed, created_at DESC
        `;
        const [result] = await pool.query(sql);
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '조회 중 오류 발생', error });
    }
})

app.put('/api/isCompleted/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { is_completed } = req.body;

        const sql = `
            UPDATE todo_list 
            SET is_completed = ?
            WHERE list_id = ?
        `;
        await pool.query(sql, [is_completed, id]);
        res.json({ message: '수정되었습니다.', data: {is_completed} });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'DB 수정 중 오류 발생', error });
    }
})

app.delete('/api/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;
        // 여기서 삭제하는거 아니고 is_deleted = 1로 바꿀껄
        await pool.query('DELETE FROM todo_list WHERE list_id = ?', [id]);
        res.json({ message: '삭제되었습니다.' });
    } catch(error) {
        console.log(error)
        res.status(500).json({ message: 'DB 삭제 중 오류 발생', error});
    }
})

app.listen(port, () => {
  console.log('서버가 3000번 포트에서 돌아가고 있습니다!');
});