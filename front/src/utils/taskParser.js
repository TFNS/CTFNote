
const RawParser = {
    name: "Raw parser",
    hint: "name | category",
    parse(s) {
        const tasks = []
        for (let line of s.trim().split("\n")) {
            line = line.trim()
            const [title, category] = line.split("|")
            if (!title) continue
            const task = { title: title.trim() }
            if (category) {
                task.category = category
            }
            tasks.push(task)
        }
        return tasks
    }
}

const CTFDParser = {
    name: "CTFd parser",
    hint: "paste ctfd /api/v1/challenge",
    parse(s) {
        const tasks = []
        try {
            const data = JSON.parse(s)
            for (const task of data.data) {
                tasks.push({ title: task.name, category: task.category })
            }
        } catch (e) {
            console.log(e)
        }
        return tasks
    }
}

export default [RawParser, CTFDParser]