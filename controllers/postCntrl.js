import {db} from "../db.js";

export const getPosts = (req, res) => {
    const q = req.query.cat ? "SELECT * FROM posts WHERE cat=?" : "SELECT * FROM posts";

    db.query(q, [req.query.cat], (err, data) => {
        if (err) return res.send(err);

        return res.status(200).json(data);
    })
        /*const q = "SELECT * FROM posts WHERE cat=?";

        db.query(q, [req.params.cat], (err, data) => {
            if (err) return res.send(err);
    
            return res.status(200).json(data);
        })*/

}
export const getPost = (req, res) => {
    res.json("from controller")
}
export const addPost = (req, res) => {
    const token = req.cookies.access_token;
    if (!token) return res.status(401).json("Not authenticated");

    jwt.verify(token, "jwtkey", (err, userInfo) => {
        if(err) return res.status(403).json("Token is not valid");
        const q = "INSERT INTO posts (`title`, `description`, `cat`) VALUES (?)"

        const values = [
            req.body.title,
            req.body.description,
            req.body.cat
        ];

        db.query(q, [values], (err, data) => {
            if (err) return res.status(500).json(err)
            return res.json("Post has been created");
        })
    });
}
export const deletePost = (req, res) => {
    res.json("from controller")
}
export const updatePost = (req, res) => {
    res.json("from controller")
}