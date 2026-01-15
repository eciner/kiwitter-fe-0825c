import { createServer, Response } from "miragejs"
import { jwtDecode } from "jwt-decode";

function decodeToken(token) {
    try {
        // Remove 'Bearer ' prefix if present
        const cleanToken = token.replace('Bearer ', '');
        
        // Try to decode as JWT first
        try {
            return jwtDecode(cleanToken);
        } catch {
            // If JWT decode fails, try base64 decode (for demo tokens)
            return JSON.parse(atob(cleanToken));
        }
    } catch (error) {
        console.error('Token decode error:', error);
        return null;
    }
}

function generateRandomDate() {
    const start = new Date(2025, 0, 1); // Start date: Jan 1, 2025
    const end = new Date(); // End date: current date
    const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return randomDate.getTime()
}

const authors = [
    { id: 1, name: "Ahmet Yılmaz", username: "chaotic_orange" },
    { id: 2, name: "Ayşe Demir", username: "sunny_rose" },
    { id: 3, name: "Murat Kaya", username: "blue_hawk" },
    { id: 4, name: "Fatma Aslan", username: "wild_berry" },
    { id: 5, name: "Mehmet Can", username: "quiet_storm" },
    { id: 6, name: "Elif Yılmaz", username: "soft_moon" },
    { id: 7, name: "Kemal Erdem", username: "green_earth" },
    { id: 8, name: "Zeynep Şahin", username: "silver_wings" },
    { id: 9, name: "Ali Vural", username: "golden_dream" },
    { id: 10, name: "Selin Güler", username: "silent_waves" }
];

function generateRandomAuthors() {

    return authors[Math.floor(Math.random() * authors.length)];
}

function generateRandomContent() {
    const contents = [
        "Hafıza geliştirme kursuna yazıldım. Nerede olduğunu hatırlamıyorum.",
        "Bugün çok güzel bir gün. Her şey yolunda gidiyor.",
        "Geçen hafta tatile gitmiştim. Harika bir deneyimdi.",
        "Yeni bir hobim var. Şimdi her gün fotoğraf çekiyorum.",
        "Çalışma odasında çok fazla kitap var. Hangi birini okuyacağımı bilemiyorum.",
        "Dün akşam sinemaya gittim. Gerçekten çok iyi bir film izledim.",
        "Yürüyüş yapmak gerçekten rahatlatıcı. Her gün yapmaya karar verdim.",
        "Yoga yapmaya başladım. Bedeni ve ruhu dinlendirdiğini düşünüyorum.",
        "Bugün işlerim çok yoğundu. Ama yine de keyif aldım.",
        "Yeni bir dil öğrenmeye başladım. Zor ama bir o kadar eğlenceli."
    ];
    return contents[Math.floor(Math.random() * contents.length)];
}

function generateObjects(n, fillReplies = false) {
    const objects = [];
    for (let i = 0; i < n; i++) {
        const author = generateRandomAuthors();
        const like = Math.floor(Math.random() * 30);
        objects.push({
            "id": window.crypto.randomUUID(),
            "authorId": author.id,
            "retweets": Math.floor(Math.random() * 10),
            "content": generateRandomContent(),
            "createDate": generateRandomDate(),
            "likes": like,
            "replies": fillReplies ? generateObjects(3, false) : [],
            "name": author.name,
            "username": author.username
        });
    }

    return objects;
}

function findTweetByIdRecursive(tweetsList, tweetId) {
    for (const tweet of tweetsList) {
        if (tweet.id === tweetId) {
            return tweet;
        }
        if (tweet.replies && tweet.replies.length > 0) {
            const found = findTweetByIdRecursive(tweet.replies, tweetId);
            if (found) {
                return found;
            }
        }
    }
    return null;
}

function removeTweetByIdRecursive(tweetsList, tweetId) {
    let removed = false;

    for (let i = tweetsList.length - 1; i >= 0; i--) {
        const tweet = tweetsList[i];
        if (tweet.id === tweetId) {
            tweetsList.splice(i, 1);
            removed = true;
            continue;
        }

        if (tweet.replies && tweet.replies.length > 0) {
            const removedInReplies = removeTweetByIdRecursive(tweet.replies, tweetId);
            if (removedInReplies) {
                removed = true;
            }
        }
    }

    return removed;
}

const tweetsLikedByUser = {

}

const tweets = [
    ...generateObjects(100, true)
];

createServer({

    routes() {

        this.urlPrefix = 'https://uppro-0825.workintech.com.tr/';

        this.post("/login", (schema, request) => {

            const { nickname, password } = JSON.parse(request.requestBody);
            
            console.log('Login attempt:', { nickname, password });
            console.log('Available users:', authors.map(a => a.username));

            // Find author by username
            const author = authors.find(a => a.username === nickname);
            
            if (!author) {
                console.log('User not found:', nickname);
                return new Response(401, {}, { message: "Kullanıcı adı veya şifre hatalı" });
            }

            // Create a JWT token with the user's actual data
            // Note: In a real app, this should be done on the backend
            const tokenPayload = {
                sub: author.id,
                name: author.name,
                nickname: author.username,
                iat: Math.floor(Date.now() / 1000)
            };

            // Create a JWT-like token (header.payload.signature format)
            // For demo purposes, we'll create a structure that jwtDecode can parse
            const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
            const payload = btoa(JSON.stringify(tokenPayload));
            const signature = btoa("mock-signature");
            const token = `${header}.${payload}.${signature}`;

            console.log('Login successful for:', nickname);
            console.log('Token created:', token);
            
            return {
                token: token,
                username: nickname,
            }
        });

        this.post("/signup", (schema, request) => {
            const { name, nickname, email, password } = JSON.parse(request.requestBody);
            
            console.log('Signup attempt:', { name, nickname, email });
            console.log('Authors before signup:', authors.map(a => a.username));
            
            // Check if user already exists
            const existingUser = authors.find(a => a.username === nickname);
            if (existingUser) {
                console.log('User already exists:', nickname);
                return new Response(400, {}, { message: "Bu kullanıcı adı zaten kullanılıyor" });
            }
            
            // Create new user and add to authors array
            const newUser = {
                id: Math.floor(Math.random() * 10000) + 100,
                name: name,
                username: nickname,
                email: email,
                password: password
            };
            
            authors.push(newUser);
            
            console.log('New user added:', newUser.username);
            console.log('Authors after signup:', authors.map(a => a.username));
            
            return {
                message: "Kayıt başarılı",
                user: {
                    id: newUser.id,
                    name: newUser.name,
                    username: newUser.username
                }
            };
        })

        this.get("/tweets", (schema, request) => {

            const token = request.requestHeaders['Authorization'];

            if (token) {

                const decoded = decodeToken(token);
                const { sub: userId } = decoded;

                return {
                    tweets: tweets.map(tweet => ({
                        ...tweet,
                        likedByUser: tweetsLikedByUser[userId] && tweetsLikedByUser[userId].includes(tweet.id) ? true : false
                    }))
                }
            } else {

                return {
                    tweets
                }
            }
        })

        this.post("/tweets", (schema, request) => {

            const { content } = JSON.parse(request.requestBody);
            const token = request.requestHeaders['Authorization'];

            const decoded = decodeToken(token);

            const newTweet = {
                "id": window.crypto.randomUUID(),
                "authorId": decoded.sub,
                "retweets": 0,
                "content": content,
                "createDate": Date.now(),
                "likes": 0,
                "replies": [],
                "name": decoded.name,
                "username": decoded.nickname,
            }

            tweets.push(newTweet);

            return {
                tweet: newTweet
            }
        });

        // More specific routes first for MirageJS routing
        this.delete("/tweets/:tweetId/like", (schema, request) => {

            const { tweetId } = request.params;
            const token = request.requestHeaders['Authorization'];

            const decoded = decodeToken(token);
            const { sub: userId } = decoded;

            const tweet = tweets.find(tweet => tweet.id === tweetId);

            if (!tweetsLikedByUser[userId]) {

                return new Response(200);
            }

            tweetsLikedByUser[userId] = tweetsLikedByUser[userId].filter(id => id !== tweetId);

            tweet.likes--;

            return {
                count: tweet.likes,
                likedByUser: false
            }
        });

        this.post("/tweets/:tweetId/like", (schema, request) => {

            const { tweetId } = request.params;
            const token = request.requestHeaders['Authorization'];

            const decoded = decodeToken(token);
            const { sub: userId } = decoded;

            const tweet = tweets.find(tweet => tweet.id === tweetId);

            if (tweetsLikedByUser[userId]) {

                tweetsLikedByUser[userId].push(tweetId);

            } else {

                tweetsLikedByUser[userId] = [tweetId];
            }

            tweet.likes++;

            return {
                count: tweet.likes
            }
        });

        this.post("/tweets/:tweetId/replies", (schema, request) => {
            const { tweetId } = request.params;
            const token = request.requestHeaders['Authorization'];
            const { content } = JSON.parse(request.requestBody);

            const decoded = decodeToken(token);
            const { sub: authorId, name, nickname: username } = decoded;

            const parentTweet = findTweetByIdRecursive(tweets, tweetId);

            if (!parentTweet) {
                return new Response(404, {}, { error: "Tweet not found" });
            }

            const newReply = {
                "id": Math.random().toString(36).substring(2, 15),
                "content": content,
                "name": name,
                "username": username,
                "authorId": authorId,
                "createDate": Date.now(),
                "likes": 0,
                "retweets": 0,
                "likedByUser": false,
                "replies": []
            };

            parentTweet.replies.push(newReply);

            return {
                reply: newReply
            };
        });

        this.get("/tweets/:tweetId", (schema, request) => {
            const { tweetId } = request.params;
            const token = request.requestHeaders['Authorization'];

            const tweet = findTweetByIdRecursive(tweets, tweetId);

            if (!tweet) {
                return new Response(404, {}, { error: "Tweet not found" });
            }

            if (token) {
                const decoded = decodeToken(token);
                const userId = decoded?.sub;
                return {
                    ...tweet,
                    likedByUser: userId && tweetsLikedByUser[userId] && tweetsLikedByUser[userId].includes(tweet.id) ? true : false
                };
            }

            return tweet;
        });

        this.delete("/tweets/:tweetId", (schema, request) => {
            const { tweetId } = request.params;
            const token = request.requestHeaders['Authorization'];

            if (!token) {
                return new Response(401, {}, { error: "Unauthorized" });
            }

            const decoded = decodeToken(token);

            const removed = removeTweetByIdRecursive(tweets, tweetId);

            if (!removed) {
                return new Response(404, {}, { error: "Tweet not found" });
            }

            // Remove from likes tracking
            Object.keys(tweetsLikedByUser).forEach(user => {
                if (tweetsLikedByUser[user]) {
                    tweetsLikedByUser[user] = tweetsLikedByUser[user].filter(id => id !== tweetId);
                }
            });

            return new Response(204);
        });

        this.get("/users/me", (schema, request) => {

            const token = request.requestHeaders['Authorization'];

            const decoded = decodeToken(token);
            const { sub: id, name, nickname: username } = decoded;

            return {
                id, name, username
            }
        });

        this.get("/users/:username", (schema, request) => {

            const { username } = request.params;

            const author = authors.find(author => author.username === username);

            if (author) {

                return {
                    id: author.id,
                    name: author.name,
                    username: author.username
                }
            }

            return new Response(404);
        });
    },
});