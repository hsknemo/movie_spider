require("dotenv").config();

const { PrismaClient } = require("@prisma/client");
const { PrismaMariaDb } = require("@prisma/adapter-mariadb");

const adapter = new PrismaMariaDb({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT || 3306),
});

const prisma = new PrismaClient({
  adapter,
  // log: ['query', 'info', 'warn', 'error'],
});

prisma.$on("query", (e) => {
  console.log(
    "---------------------------start-------------------------------",
  );
  console.log("Query:", e.query);
  console.log("Params:", e.params);
  console.log("Duration:", e.duration + "ms");
  console.log("---------------------------end-------------------------------");
});

// mariadb driver 3.4.5 bug: pool.end() 不会清理所有连接的 socket
// （包括未完成握手的、以及部分已传输数据的），导致进程无法退出。
// shutdown() 在 $disconnect() 之后对残留的 socket 调用 unref()，
// 让 event loop 忽略它们，进程即可正常退出。
prisma.shutdown = async function () {
  await this.$disconnect();
  for (const handle of process._getActiveHandles()) {
    if (
      handle.constructor &&
      handle.constructor.name === "Socket" &&
      !handle.destroyed &&
      typeof handle.unref === "function"
    ) {
      handle.unref();
    }
  }
};

module.exports = prisma;
