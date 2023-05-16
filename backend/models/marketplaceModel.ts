import { faker } from '@faker-js/faker';

const fakeUrl: { id: number; url: string }[] = [];
for (let i = 0; i <= 20; i++) {
  const newUrl = {
    id: i + 1,
    url: faker.image.url(),
  };
  fakeUrl.push(newUrl);
}

const marketplaceModel = {
  getAll: () => {
    return fakeUrl;
  },
};

export default marketplaceModel;
