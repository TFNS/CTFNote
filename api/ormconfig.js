module.exports = {
   "type": "postgres",
   "host": process.env.TYPEORM_HOST || "127.0.0.1",
   "port": 5432,
   "username": "ctfnote",
   "password": "ctfnote",
   "database": "ctfnote",
   "synchronize": true,
   "logging": false,
   "entities": [
      "src/entity/**/*.ts"
   ],
   "migrations": [
      "src/migration/**/*.ts"
   ],
   "subscribers": [
      "src/subscriber/**/*.ts"
   ],
   "cli": {
      "entitiesDir": "src/entity",
      "migrationsDir": "src/migration",
      "subscribersDir": "src/subscriber"
   }
}
