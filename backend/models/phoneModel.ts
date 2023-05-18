import { faker } from '@faker-js/faker';

const fakePhonNum: { id: number; phone: string }[] = [];
for (let i = 0; i <= 20; i++) {
  const newPhone = {
    id: i + 1,
    phone: faker.phone.number('+1##########'),
  };
  fakePhonNum.push(newPhone);
}

const phoneModel = {
  getAll: () => {
    return fakePhonNum;
  },

  getByPhoneNum: (phoneNum: string) => {
    const result: { id: number; phone: string }[] = [];
    fakePhonNum.forEach((phoneEntry) => {
      if (phoneEntry.phone === phoneNum) {
        result.push(phoneEntry);
      }
    });
    return result;
  },

  addOne: (phoneNum: string) => {
    try {
      const newPhone = {
        id: fakePhonNum.length + 1,
        phone: phoneNum,
      };
      fakePhonNum.push(newPhone);
    } catch (err) {
      return err;
    }
  },
};

export default phoneModel;
