import { EntityRepository, Repository, getRepository } from 'typeorm';
import { messagers } from './entity/messager.entity';
import { SearchUser } from './dto/SearchUser.dto';
import { Logger } from '@nestjs/common';

@EntityRepository(messagers)
export class AccountSearchRepository extends Repository<messagers> {
  SearchUser = async (UserEmail: string, getThingsDto: SearchUser) => {
    const { chat_to } = getThingsDto;
    try {
      const things = await getRepository(messagers)
        .createQueryBuilder('things')
        .where(' things.name LIKE :search or things.email LIKE :search', {
          search: '%' + chat_to + '%',
        })
        .getMany();
      let DataArr = [];
      for (let i = 0; i < things.length; i++) {
        if (things[i].email !== UserEmail) {
          DataArr = DataArr.concat(things[i]);
        }
      }
      if (DataArr.length > 0 && chat_to !== '' && chat_to !== ' ') {
        return {
          message: 'Things retrieved successfully!! ',
          searchresults: DataArr,
        };
      } else {
        return {
          statusCode: 400,
          error: 'No things are found....',
          searchresults: [],
        };
      }
    } catch (err) {
      console.log(err);
      return {
        statusCode: 400,
        error: 'Error retrieving stored things..',
      };
    }
  };
}
