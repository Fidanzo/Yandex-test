import { test, expect } from '@playwright/test';
import { defineConfig, devices } from '@playwright/test';

test.use({ viewport: { width: 1820, height: 1000 } });
test.use({
  locale: 'ru-RU',
});
test.use({ permissions: [] });
test('Переход в ресторан', async ({ page }) => {
  await page.goto('https://testing.eda.tst.yandex.ru/moscow?shippingType=delivery');
  await page
    .locator(
      "[src='https://testing.eda.tst.yandex.ru/images/16375285/34d4d52967174ac08aecd9d850d7070d-450x300.jpg']",
    )
    .click();
  await expect(page).toHaveURL(
    'https://testing.eda.tst.yandex.ru/r/teremok1365?placeSlug=Teremok_Taganskaya',
  );

  await page.close();
});

test('Ввод в строку поиска и переход в ресторан', async ({ page }) => {
  await page.goto('https://testing.eda.tst.yandex.ru/moscow?shippingType=delivery');
  await page.getByPlaceholder('Найти ресторан, блюдо или товар').fill('Бургер');
  await page.getByRole('button', { name: 'Найти' }).click();
  await expect(page.getByTitle('Бургер Синий Сырок куриный')).toContainText('Бургер Синий');

  await page.close();
});

test('Смена адреса, переход в рестора и добавление блюда в корзину', async ({ page }) => {
  await page.goto('https://testing.eda.tst.yandex.ru/moscow?shippingType=delivery');
  await page.getByRole('button', { name: 'Укажите адрес доставки' }).click();
  await page.getByTestId('address-input').fill('Ленинский проспект 37а');
  await page.getByRole('option', { name: 'Ленинский проспект, 37А, подъезд 9' }).click();
  await page.getByRole('button', { name: 'ОК' }).click();
  await page
    .locator(
      "[src='https://testing.eda.tst.yandex.ru/images/15263514/79f2efd3ea0e3a8ffbda065aaf2166f9-450x300.jpg']",
    )
    .click();
  await page
    .getByRole('listitem')
    .filter({ hasText: '49 ₽Сладкий пирожок с яблоком' })
    .getByLabel('В корзину')
    .click();
  await expect(page.getByRole('button', { name: 'Очистить' })).toContainText('Очистить');

  await page.close();
});
