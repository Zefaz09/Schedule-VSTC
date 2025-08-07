import axios from 'axios';
import { parseHTML } from 'linkedom';

export async function viewSchedule(url: string): Promise<string[][]> {
  try {
    const response = await axios.get(url);
    const html = response.data;

    const { document } = parseHTML(html);
    const table = document.querySelector('table');
    const rows = table?.querySelectorAll('tr');

    const matrix: any[][] = [];
    let y = 0;

    rows?.forEach((rowEl: { querySelectorAll: (arg0: string) => any; }) => {
      const cells = rowEl.querySelectorAll('td');
      let x = 0;

      cells.forEach((cellEl: { getAttribute: (arg0: string) => any; }) => {
        const rowspan = parseInt(cellEl.getAttribute('rowspan') || '1', 10);
        const colspan = parseInt(cellEl.getAttribute('colspan') || '1', 10);

        while (matrix[y] && matrix[y][x]) x++;

        for (let dy = 0; dy < rowspan; dy++) {
          const rowY = y + dy;
          if (!matrix[rowY]) matrix[rowY] = [];

          for (let dx = 0; dx < colspan; dx++) {
            matrix[rowY][x + dx] = cellEl;
          }
        }

        x += colspan;
      });

      y++;
    });

    let foundY = -1;
    let foundX = -1;

    for (let y = 0; y < matrix.length; y++) {
      for (let x = 0; x < matrix[y]?.length; x++) {
        const cell = matrix[y][x];
        if (cell?.textContent.trim() === 'ВР-21') {
          foundY = y;
          foundX = x;
          break;
        }
      }
      if (foundY !== -1) break;
    }

    const lessons: string[] = [];
    const rooms: string[] = [];
    const times: string[] = [];

    if (foundY === -1 || foundX === -1) {
      console.log('⛔ Группа ВР-21 не найдена');
    } else {
      for (let i = 0; i <= 11; i++) {
        const lessonCell = matrix[foundY + i]?.[foundX];
        const roomCell = matrix[foundY + i]?.[foundX + 1];
        const timeCell = matrix[3 + i]?.[1];
        if (lessonCell) {
          lessons.push(lessonCell.textContent.trim());
          rooms.push(roomCell.textContent.trim());
          times.push(timeCell.textContent.trim());
        } else {
          console.log(`🕳️ Ячейка ${i} отсутствует`);
        }
      }
    }

    return [times, lessons, rooms];
  } catch (err) {
    console.error('❌ Ошибка при загрузке расписания:', err);
    return [];
  }
}