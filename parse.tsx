import axios from 'axios';
import { parseHTML } from 'linkedom';
import jestConfig from './jest.config';

export async function viewSchedule(url: string, group: string): Promise<[string[], Record<string, number>, string[]]> {
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
        if (cell?.textContent.trim() === group) {
          foundY = y;
          foundX = x;
          break;
        }
      }
      if (foundY !== -1) break;
    }

    let lessons: Record<string, number> = {};
    const rooms: string[] = [];
    const times: string[] = [];
    var rowspan = 1;
    const getText = (el: any) => (el?.textContent ?? "").trim();

    if (foundY === -1 || foundX === -1) {
      console.log('⛔ Группа ВР-21 не найдена');
    } else {
      for (let i = 0; i <= 10; i++) {
        const lessonCell = matrix[foundY + i]?.[foundX];
        const roomCell = matrix[foundY + i]?.[foundX + 1];
        const timeCell = matrix[3 + i]?.[1];
        if (lessonCell) {
            times.push(getText(timeCell));
            const name = getText(lessonCell);
            if (name) {
            lessons[name] = (lessons[name] || 0) + 1;
            }

            rooms.push(getText(roomCell));
        } else {
        console.log(`🕳️ Ячейка ${i} отсутствует`);
        }
    }
    }

    const lessonsEntries = Object.entries(lessons);

   for (let i = 0; i < lessonsEntries.length; i++) {
    const [lessonI, countI] = lessonsEntries[i];

    for (let j = i + 1; j < lessonsEntries.length; j++) {
        const [lessonJ, countJ] = lessonsEntries[j];

        if (lessonI === lessonJ && countJ !== 0) {
        lessonsEntries[i][1] += countJ;
        lessonsEntries[j][1] = 0;
        }
    }
    }

    // Удаляем нулевые элементы
    const filteredEntries = lessonsEntries.filter(([_, count]) => count > 0);
    lessons = Object.fromEntries(filteredEntries);


    return [times, lessons, rooms];
  } catch (err) {
    console.error('❌ Ошибка при загрузке расписания:', err);
    return [[], {}, []];
  }
}