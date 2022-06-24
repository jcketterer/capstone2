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
    return res.skill;
  }

  static async getSkillByName(name = '') {
    let data = {};
    if (name !== '') data.name = name;

    let res = await this.request(`skill/`, data);
    return res.skill;
  }

  static async editSkill(skill) {
    let skillToEdit = { ...skill };
    delete skillToEdit.name;

    let res = await this.request(`skill/${skill.name}`, skillToEdit, 'PATCH');
    return res;
  }

  //ADVOCATES

  static async addAdvocate(advocate) {
    let res = await this.request(`advo/`, advocate, 'POST');
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

  static async getAdvocate(
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
    return res.advocate;
  }

  static async editAdvocate(advocateId, updatedAdvocate) {
    let res = await this.request(`advo/${advocateId}`, updatedAdvocate, 'PATCH');
    return res;
  }

  static async indicateSkillsAssingedToAdvocate(listOfSkills, advocateId) {
    let advocate = await this.getAdvocate(advocateId);
    return listOfSkills.map(skill => {
      return { ...skill, skillsAssigned: advocate.skill.includes(skill.name) };
    });
  }

  static async addSkillToAdvo(advocateId, skillName) {
    try {
      let res = await this.request(`advo/${advocateId}/addskill/${skillName}`);
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
}

export default AdvocateAPI;