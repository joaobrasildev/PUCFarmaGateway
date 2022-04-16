import axios from 'axios';

export class UsersProvider {
  public async findOneUser(id: string) {
    const url = `http://localhost:3001/users/${id}`
    const response = await axios.get(url);
    console.log(response)
    return 'success'
  }
}
