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

  getByLink: (link: string) => {
    const result: { id: number; url: string }[] = [];
    fakeUrl.forEach((urlEntry) => {
      if (urlEntry.url === link) {
        result.push(urlEntry);
      }
    });
    return result;
  },
};

export default marketplaceModel;
