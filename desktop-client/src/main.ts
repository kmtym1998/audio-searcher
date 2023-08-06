import { BrowserWindow, app, ipcMain, nativeImage } from 'electron';
import path from 'path';
import { getAudioCoverArt } from './graphql/audio-cover-art';

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 1080,
    x: 99999,
    y: 0,
    webPreferences: {
      preload: path.resolve(__dirname, 'preload.js'),
    },
  });

  mainWindow.loadFile(path.resolve(__dirname, 'main.js'));
  mainWindow.webContents.openDevTools({ mode: 'detach' });
};

app.whenReady().then(() => {
  createWindow();
});

app.once('window-all-closed', () => app.quit());

ipcMain.on('ondragstart', (event, filePath) => {
  getAudioCoverArt(filePath)
    .then((base64Img) => {
      const bufImg = Buffer.from(base64Img, 'base64');

      event.sender.startDrag({
        file: filePath,
        icon: nativeImage.createFromBuffer(bufImg).resize({ width: 128 }),
      });
    })
    .catch((err) => {
      console.warn(err);

      event.sender.startDrag({
        file: filePath,
        icon: nativeImage
          .createFromDataURL(
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEhklEQVR4nO2aS4vUQBDHM+pJ8IGgIqjgwcdd3ekaV/Yiy4rVu3qYi/gJxIP4BeYo3kVJ9e4qeFvRg8jiQRBfH0Bd8XETQUFU8IGyio5UHpjNe2aSTDLpPzRMpyevX6q6qisxDC0tLS0tLS0tLS2t/ARonm5KtTXHU4w2PJCqC0jPNcQ+BCcubQFUTxmiQHp5+IS5rZ/j1FrjU3ObNcSUstzVbUjLgLPH/RDr2Ayj2+gdoIbY7Rtg1Hjd3Bkk/c0UYN0gQh4A6wQR8gJYF4iZAaxLYDF8oPIBOMIQjbwBjqo7QwSowgBWHWIpAFYZYmkAugUIgWrJhqiWiq7iANIjbpUFGAaR+0ZBAqkecqs0wKIgCqmuC6kexN9gtyGQ7gPSQqUAFgGR4YFUr4xOZ1XknzqdVfyfOKssLcD8IXYbLryxKdpuWSTSV24g1c2DR2kPj7XbC6vjIJQaYBGWyPBA0qdgckyfeCxp/9IDDECU9CxLiGx5zjUuMjAbqFq0z6WuVwpgu72wemKisyZPiALVY2+qApK+8DEPzMzvcLc5EDkf/ZqU4pQC4MTMlY1C0rxA9c1aK0u6NSZpVx4QLRCeoBAHkMeSUpyhAxz3FhRQ/RFS/XYAfQA0D+btzoB0w3VhhsjNdWEeS9x/mADHvcs3Sc8OobnTskak207Q+NbC2ck8IXK0DQsiQqrPbiQuJcDxqbnN1s2HQOB5EJCuOlawLFCdzB5it2GnKI7LIi3Y7kxf2PKaxy7vtv4WlycOCyDwzbvwIlOTbgOQLvx3bTqbJUQnkX7tQoxLpO0VS0kAQgp43kjZRDrnXoyQdD5woX1CZIvjZVqapVxcOlMowHSWZwQiZUuqU4DqlwNp3p/q+CHy9JDqoqtUjRm0VNVE8yhI+u6kF7f2o7nWmkenzSOZpThlrsa4NweofkTB8ye5/n5z2mwC0kfneI+tCI607EbqPFcsw7dA+6Z+gqR7qZNcX9/eZu4TUr3xPhjvAykaYnEAM/xOcIyrJ6iWoubRuALE2NS19UKqiyDVW278m7e1pmfXhW0vjwtLuhvlmr26srVtUm2Ks66wOTfqNar1MJzg5vOYRAsuEKC6E+eavbpyGgUsEemJC6Y1PbuXmxdo2PakEtrQ18J5y291/jd+7njUdufhv4h6S1gowCTXFD32/Yoa91pi2FzM42Hz84rlpr3/ZZD0XqB6x7/3t80NxSbSCa4JPfYD54oZZ0BxECOP6Un+Q+fIUXfhLCHa86i5z06lVkItIg/MzPJgAEtNAzFsReJ3c6971wpgGogWwBRrYivQ1MmFvVpZ2Oj/W5xKBxEowhJXvD8J7XdrCzAJot+VQ/vD/sCy6u5cZDVmaJYHKSwz0RIjXLm+ADEYZaMgxrlybaNwVu5cqygMga8Swkv4bHlsgaGWOKwoXImGtNySNJO0Bg5rGqAcDGJuAKsu8M6JMXXBwH4a4GAQNcABIWqAA0LsG+BINswuOtcToMwuOmsNGJ21PNIQM5B32SekOpPFMWunJldxNDwtLS0tLS0tLS0tI1f9A//RieBEzw5FAAAAAElFTkSuQmCC',
          )
          .resize({ width: 80 }),
      });
    });
});
