const RawParser = {
  name: "Raw parser",
  hint: "name | category",
  parse(s) {
    const tasks = [];
    for (const line of s.trim().split("\n")) {
      let [title, ...category] = line.split("|");
      title = title.trim();
      category = category.join("|").trim();
      if (!title || !category) {
        continue;
      }
      tasks.push({ title, category });
    }
    return tasks;
  },
  isValid(s) {
    return s
      .trim()
      .split("\n")
      .every(s => s.match(/[^|]+\|[^|]+/));
  }
};

const CTFDParser = {
  name: "CTFd parser",
  hint: "paste ctfd /api/v1/challenge",

  _getJson(s) {
    try {
      return JSON.parse(s);
    } catch (e) {
      return null;
    }
  },

  parse(s) {
    const tasks = [];
    const data = this._getJson(s);
    if (!Array.isArray(data?.data)) {
      return null;
    }
    for (const task of data.data) {
      if (!task.name || !task.category) {
        continue;
      }
      tasks.push({ title: task.name, category: task.category });
    }
    return tasks;
  },
  isValid(s) {
    const data = this._getJson(s);
    return Array.isArray(data?.data);
  }
};

export default [RawParser, CTFDParser];
