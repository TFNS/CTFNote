const RawParser = {
  name: "Raw parser",
  hint: "name | category",
  parse(s) {
    const tasks = [];
    for (let line of s.split("\n")) {
      let [title, category] = line.split("|");

      title = title?.trim();
      category = category?.trim();

      if (!title || !category) continue;
      tasks.push({ title, category });
    }
    return tasks;
  }
};

const CTFDParser = {
  name: "CTFd parser",
  hint: "paste ctfd /api/v1/challenge",
  parse(s) {
    const tasks = [];
    try {
      const data = JSON.parse(s);
      for (const task of data.data) {
        tasks.push({ title: task.name, category: task.category });
      }
    } catch (e) {
      console.err(e);
    }
    return tasks;
  }
};

export default [RawParser, CTFDParser];
