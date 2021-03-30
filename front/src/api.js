import { sleep } from "./utils";

function choice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

class API {
  constructor(host) {
    this.host = host;
  }

  handleError(data) {
    if (data.errors) {
      throw data.errors;
    }
    return data;
  }

  async get(path) {
    const r = await fetch(`${this.host}${path}`);
    const data = await r.json();
    return this.handleError(data);
  }

  async delete(path) {
    const method = "DELETE";
    const r = await fetch(`${this.host}${path}`, { method });
    if (r.status == 204) {
      return {};
    }
    const data = await r.json();
    return this.handleError(data);
  }

  async postJson(path, obj) {
    const body = JSON.stringify(obj);
    const method = "POST";
    const r = await fetch(`${this.host}${path}`, {
      method,
      body,
      headers: { "Content-Type": "application/json" }
    });
    const data = await r.json();
    return this.handleError(data);
  }

  async putJson(path, obj) {
    const body = JSON.stringify(obj);
    const method = "PUT";
    const r = await fetch(`${this.host}${path}`, {
      method,
      body,
      headers: { "Content-Type": "application/json" }
    });
    const data = await r.json();
    return this.handleError(data);
  }

  async getCtfs(filter = "incoming") {
    return this.get(`/ctfs?filter=${encodeURIComponent(filter)}`);
  }
  async getCtf(name) {
    const ctf = await this.get(`/ctf/${name}`);
    return ctf;
  }

  async createCtf(ctf) {
    return this.postJson("/ctf", ctf);
  }
  async updateCtf(ctfSlug, ctf) {
    return this.putJson(`/ctf/${ctfSlug}`, ctf);
  }
  async deleteCtf(ctfSlug) {
    return this.delete(`/ctf/${ctfSlug}`);
  }

  async importCtf(ctfTimeIdentifier) {
    return this.postJson("/ctf-import", { ctfTimeIdentifier });
  }

  async setCtfTasks(ctfSlug, tasks) {
    return this.postJson(`/ctf/${ctfSlug}/task`, { tasks });
  }

  async onIt(ctfSlug, taskSlug, onIt) {
    return this.putJson(`/ctf/${ctfSlug}/tasks/${taskSlug}/onit`, { onIt });
  }
  async solveTask(ctfSlug, taskSlug, solved) {
    return this.putJson(`/ctf/${ctfSlug}/tasks/${taskSlug}`, { solved });
  }

  async updateCtfPlayer(ctfSlug, playerSlug, playing) {
    return this.putJson(`/ctf/${ctfSlug}/invite`, {
      userSlug: playerSlug,
      invite: playing
    });
  }
  async updateTaskTitle(ctfSlug, taskSlug, title) {
    return this.putJson(`/ctf/${ctfSlug}/tasks/${taskSlug}`, { title });
  }

  async updateTaskCategory(ctfSlug, taskSlug, category) {
    return this.putJson(`/ctf/${ctfSlug}/tasks/${taskSlug}`, { category });
  }
  async updateTaskDescription(ctfSlug, taskSlug, description) {
    return this.putJson(`/ctf/${ctfSlug}/tasks/${taskSlug}`, { description });
  }
  async deleteTask(ctfSlug, taskSlug) {
    return this.delete(`/ctf/${ctfSlug}/tasks/${taskSlug}`);
  }

  async register(username, password) {
    return this.postJson("/auth/register", { username, password });
  }

  async login(username, password) {
    return this.postJson("/auth/login", { username, password });
  }

  async listExternalAuthenticationModules(username, password) {
    return this.get("/auth/list");
  }

  async externalAuth(module){
    window.open(`${this.host}/auth/${module}`, "_self")
  }

  async logout() {
    return this.postJson("/auth/logout", { logout: true });
  }

  async getUsers() {
    return this.get("/users");
  }

  async updateUser(userSlug, updates) {
    return this.putJson(`/users/${userSlug}`, updates);
  }
  async deleteUser(userSlug) {
    return this.delete(`/users/${userSlug}`);
  }
  async me() {
    return this.get("/me");
  }

  async getConfiguration() {
    return this.get("/admin/config");
  }

  async setConfiguration(config) {
    return this.putJson("/admin/config", config);
  }
}

const api = new API("/api");

export default api;
