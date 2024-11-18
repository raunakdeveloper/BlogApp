### Blog Post App - Backend Documentation

Yeh documentation aapko Blog Post app ka backend samajhne aur set up karne me madad karega. Hum yahan step-by-step backend code explain karenge aur saath hi yeh bhi batayenge ki kis tarah se dependencies install karni hain.

---

### Project Structure

Pehle, hum apne project ka folder structure dekhte hain:

```
config/
    mongoose.js              - MongoDB connection setup
controllers/
    commentController.js     - Comments se related functions (create, get)
    likeController.js        - Likes se related functions (create, delete)
    postController.js        - Posts se related functions (create, get)
models/
    commentModel.js          - Comment schema aur model
    likeModel.js             - Like schema aur model
    postModel.js             - Post schema aur model
routes/
    commentRoutes.js         - Comments ke liye routes
    likeRoutes.js            - Likes ke liye routes
    postRoutes.js            - Posts ke liye routes
.env                         - Environment variables (e.g., MongoDB URI)
.gitignore                   - Jo files git ko ignore karni hoti hain, unka list
README.md                   - Project ki documentation
server.js                   - Main entry point (server start karne ka code)
package.json                - Project dependencies aur configurations
```

---

### Dependencies

Yeh backend application kuch important dependencies pe kaam karta hai:

1. **express**: Yeh ek web framework hai jo Node.js me HTTP requests ko handle karta hai.
2. **mongoose**: MongoDB ke saath interact karne ke liye ek ORM (Object-Relational Mapping) tool hai.
3. **dotenv**: Environment variables ko load karne ke liye, jaise MongoDB URI.
4. **nodemon** (devDependency): Yeh development phase me server ko automatically restart karne ke liye use hota hai jab bhi code me koi changes hote hain.

**Dependencies install karne ke liye, aapko yeh command chalani hogi:**

```bash
npm install
```

---

### Code Samajhna

#### 1. **MongoDB Connection Setup (config/mongoose.js)**

```javascript
const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB Connection Successfully...");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
    }
}

module.exports = connectDB;
```

- **mongoose**: Yeh MongoDB ke saath connection banane ke liye use hota hai. `mongoose.connect()` ko MongoDB ke URI ke saath call kiya jaata hai.
- **process.env.MONGODB_URI**: Yeh `.env` file se MongoDB ka URI load karne ke liye use hota hai.

**Yeh `connectDB` function MongoDB se connect karta hai aur agar koi error aati hai toh woh error ko log karta hai.**

---

#### 2. **Controllers**

Controllers wo functions hain jo actual business logic handle karte hain, jaise ki post, comment, aur like ko manage karna.

##### 2.1 **Post Controller (controllers/postController.js)**

```javascript
const Post = require("../models/postModel");

// Create a new post
const createPost = async (req, res) => {
    try {
        const { title, content } = req.body;
        if (!title || !content) {
            return res.status(400).json({ message: "Title and content are required" });
        }

        const newPost = new Post({ title, content });
        const savePost = await newPost.save();
        res.status(201).json({
            post: savePost,
            message: "Post created successfully"
        });
    } catch (err) {
        res.status(500).json({ message: "Error creating post", error: err.message });
    }
};

// Get all posts
const getPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate("comments").populate("likes").exec();
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json({ message: "Error fetching posts", error: err.message });
    }
};

module.exports = { createPost, getPosts };
```

- **`createPost`**: Yeh function naya post create karta hai. Agar `title` aur `content` missing hain toh 400 error return karta hai.
- **`getPosts`**: Yeh function sabhi posts ko retrieve karta hai, aur saath me unke comments aur likes bhi populate karta hai using `.populate()` method.

##### 2.2 **Comment Controller (controllers/commentController.js)**

```javascript
const Post = require("../models/postModel");
const Comment = require("../models/commentModel");

const createComment = async (req, res) => {
    try {
        const { post, user, content } = req.body;
        if (!post || !user || !content) {
            return res.status(400).json({ message: "Post, user, and content are required" });
        }

        const comment = new Comment({ post, user, content });
        const newComment = await comment.save();

        const updatedPost = await Post.findByIdAndUpdate(post, { $push: { comments: newComment._id } }, { new: true })
            .populate("comments")
            .exec();

        res.status(201).json({ post: updatedPost, message: "Comment created successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error creating comment", error: error.message });
    }
};

module.exports = { createComment };
```

- **`createComment`**: Yeh function naya comment create karta hai aur usse related post me add karta hai.

##### 2.3 **Like Controller (controllers/likeController.js)**

```javascript
const Post = require("../models/postModel");
const Like = require("../models/likeModel");

const createLike = async (req, res) => {
    try {
        const { post, user } = req.body;
        if (!post || !user) {
            return res.status(400).json({ message: "Post and user are required" });
        }

        const existingLike = await Like.findOne({ post, user });
        if (existingLike) {
            return res.status(400).json({ message: "User has already liked the post" });
        }

        const newLike = new Like({ post, user });
        await newLike.save();

        const updatedPost = await Post.findByIdAndUpdate(post, { $push: { likes: newLike._id } }, { new: true })
            .populate("likes")
            .exec();

        res.status(201).json({ post: updatedPost, message: "Like added successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error adding like", error: error.message });
    }
};

const createUnlike = async (req, res) => {
    try {
        const { post, like } = req.body;
        if (!post || !like) {
            return res.status(400).json({ message: "Post and like ID are required" });
        }

        const deletedLike = await Like.findOneAndDelete({ post, _id: like });
        if (!deletedLike) {
            return res.status(404).json({ message: "Like not found" });
        }

        const updatedPost = await Post.findByIdAndUpdate(post, { $pull: { likes: deletedLike._id } }, { new: true })
            .populate("likes")
            .exec();

        res.status(200).json({ post: updatedPost, message: "Like removed successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error removing like", error: error.message });
    }
};

module.exports = { createLike, createUnlike };
```

- **`createLike`**: Yeh function post ko like karta hai.
- **`createUnlike`**: Yeh function like ko remove karta hai agar post ko pehle like kiya gaya ho.

---

#### 3. **Models**

Models define karte hain ki data ka structure kya hoga MongoDB me.

##### 3.1 **Post Model (models/postModel.js)**

```javascript
const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Like" }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }]
});

module.exports = mongoose.model("Post", postSchema);
```

- **`postSchema`**: Post ka structure define karte hain. Har post ka ek `title`, `content`, `likes`, aur `comments` field hota hai.

##### 3.2 **Comment Model (models/commentModel.js)**

```javascript
const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
    user: { type: String, required: true },
    content: { type: String, required: true }
});

module.exports = mongoose.model("Comment", commentSchema);
```

- **`commentSchema`**: Yeh comment ka structure define karta hai. Har comment ka `post` (jo post pe comment ho

 raha hai), `user`, aur `content` hota hai.

##### 3.3 **Like Model (models/likeModel.js)**

```javascript
const mongoose = require("mongoose");

const likeSchema = mongoose.Schema({
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
    user: { type: String, required: true }
});

module.exports = mongoose.model("Like", likeSchema);
```

- **`likeSchema`**: Yeh like ka structure define karta hai. Har like ka `post` (jisme like kiya gaya hai) aur `user` hota hai.

---

### Routes

Routes define karte hain ki kis endpoint pe kis controller ka function call hoga.

##### 4.1 **Post Routes (routes/postRoutes.js)**

```javascript
const express = require("express");
const { createPost, getPosts } = require("../controllers/postController");
const router = express.Router();

router.post("/create", createPost);
router.get("/", getPosts);

module.exports = router;
```

- **POST `/api/posts/create`**: Naya post create karta hai.
- **GET `/api/posts/`**: Sabhi posts ko retrieve karta hai.

##### 4.2 **Comment Routes (routes/commentRoutes.js)**

```javascript
const express = require("express");
const { createComment } = require("../controllers/commentController");
const router = express.Router();

router.post("/comment", createComment);

module.exports = router;
```

- **POST `/api/comments/comment`**: Naya comment create karta hai.

##### 4.3 **Like Routes (routes/likeRoutes.js)**

```javascript
const express = require("express");
const { createLike, createUnlike } = require("../controllers/likeController");
const router = express.Router();

router.post("/like", createLike);
router.post("/unlike", createUnlike);

module.exports = router;
```

- **POST `/api/likes/like`**: Post ko like karta hai.
- **POST `/api/likes/unlike`**: Post ko unlike karta hai.

---

### Server Setup (server.js)

```javascript
const express = require("express");
const connectDB = require("./config/mongoose"); // MongoDB connection
const commentRoutes = require("./routes/commentRoutes");
const postRoutes = require("./routes/postRoutes");
const likeRoutes = require("./routes/likeRoutes");
require("dotenv").config(); // Load environment variables

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

connectDB();

app.use("/api/posts", postRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/comments", commentRoutes);

app.get("/", (req, res) => res.send("Hello, World!"));

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
```

- Yeh file main entry point hai jahan Express server start hota hai, routes define hote hain, aur MongoDB connect hota hai.

---

### Environment Variables (.env)

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/blogDB
```

- **PORT**: Server kis port pe run hoga, yeh define karta hai.
- **MONGODB_URI**: MongoDB ka URI jisme aapka database store hoga.

---

### GitHub Repo Link

GitHub repo ko [yahan](#) se access kar sakte hain.

**Made by**: [raunakkaushal](#) ❤

