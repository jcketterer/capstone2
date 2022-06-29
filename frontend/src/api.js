import axios from 'axios';

const API_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:3001';

class AdvocateAPI {
  static token;

  static setToken(newToken) {
    this.token = newToken;
  }

  static async request(endpoint, data = {}, method = 'GET') {
    console.debug('API Call:', endpoint, data, method);

    const url = `${API_URL}/${endpoint}`;
    const headers = { Authorization: `Bearer ${AdvocateAPI.token}` };
    const params = method === 'get' ? data : {};

    try {
      return (await axios({ url, method, data, params, headers })).data;
    } catch (err) {
      console.error('API Error:', err.response);
      let message = err.response.data.error.message;
      throw Array.isArray(message) ? message : [message];
    }
  }

  //SKILLS

  //add skills
  static async addSkill(skill) {
    let res = await this.request(`skill/`, skill, 'POST');
    return res.skill;
  }

  static async deletedSkill(name) {
    let res = await this.request(`skill/${name}`, {}, 'DELETE');
    return res;
  }

  static async getSkill(name) {
    let res = await this.request(`skill/${name}`);
    console.log(res);
    return res.skills;
  }

  static async getSkillByName(name = '') {
    let data = {};
    if (name !== '') data.name = name;

    let res = await this.request(`skill/`, data);
    return res.skills;
  }

  static async editSkill(skill) {
    let skillToSend = { ...skill };
    console.log(skillToSend);
    delete skillToSend.name;

    let res = await this.request(`skill/${skill.name}`, skillToSend, 'PATCH');
    return res;
  }

  //ADVOCATES

  static async addAdvocate(advocate) {
    let res = await this.request(`advo/`, advocate, 'POST');
    console.log(res);
    return res.advocate;
  }

  static async deleteAdvocate(advocateId) {
    let res = await this.request(`advo/${advocateId}`, {}, 'DELETE');
    return res;
  }

  static async getAdvocate(advocateId) {
    let res = await this.request(`advo/${advocateId}`);
    return res.advocate;
  }

  static async getAdvocates(
    firstName = '',
    lastName = '',
    email = '',
    milestone = '',
    teamLead = '',
    manager = ''
  ) {
    let data = {};
    if (firstName !== '') data.firstName = firstName;
    if (lastName !== '') data.lastName = lastName;
    if (email !== '') data.email = email;
    if (milestone !== '') data.milestone = milestone;
    if (teamLead !== '') data.teamLead = teamLead;
    if (manager !== '') data.manager = manager;

    let res = await this.request(`advo/`, data);
    return res.advocates;
  }

  static async editAdvocate(advocateId, updatedAdvocate) {
    let res = await this.request(`advo/${advocateId}`, updatedAdvocate, 'PATCH');
    return res;
  }

  static async indicateSkillsAssingedToAdvocate(listOfSkills, advocateId) {
    let advocate = await this.getAdvocate(advocateId);
    return listOfSkills.map(skill => {
      return { ...skill };
    });
  }

  static async addSkillToAdvo(advocateId, skillName) {
    try {
      let res = await this.request(`advo/${advocateId}/addskill/${skillName}`, 'POST');
      return res;
    } catch (err) {
      return err;
    }
  }

  static async removeSkillFromAdvocate(advocateId, skillName) {
    let res = await this.request(`advo/${advocateId}/delskill/${skillName}`, {}, 'DELETE');
    return res;
  }

  //USERS

  static async getUser(username) {
    let res = await this.request(`users/${username}`);
    return res.user;
  }

  static async login(username, password) {
    try {
      let res = await this.request('auth/token', { username, password }, 'POST');

      this.setToken(res.token);
      return res.token;
    } catch (err) {
      console.error(err);
    }
  }

  static async updateUserInfo(username, firstName, lastName, email, password) {
    try {
      try {
        await this.login(username, password);
      } catch (err) {
        throw err;
      }
      let updatedUser = await this.request(
        `users/${username}`,
        { firstName, lastName, password, email },
        'PATCH'
      );
      return updatedUser;
    } catch (err) {
      console.error(err);
    }
  }

  static async createNewUser(username, password, firstName, lastName, email) {
    try {
      let res = await this.request(
        'auth/reg',
        { username, password, firstName, lastName, email },
        'POST'
      );
      this.setToken(res.token);

      let newUser = await this.getUser(username);
      return { user: newUser, token: res.token };
    } catch (err) {
      console.error(err);
    }
  }
  static async createNewAdmin(username, password, firstName, lastName, email, isAdmin = true) {
    try {
      let res = await this.request(
        'users',
        { username, password, firstName, lastName, email, isAdmin },
        'POST'
      );
      this.setToken(res.token);

      let newUser = await this.getUser(username);
      return { user: newUser, token: res.token };
    } catch (err) {
      console.error(err);
    }
  }
}

export default AdvocateAPI;
