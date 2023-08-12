db.createUser(
    {
        user: "auth",
        pwd: "password",
        roles: [
            {
                role: "readWrite",
                db: "auth"
            }
        ]
    }
);
db.createCollection("users");

db.createUser(
    {
        user: "todo",
        pwd: "password",
        roles: [
            {
                role: "readWrite",
                db: "todo"
            }
        ]
    }
);
db.createCollection("tasks");
