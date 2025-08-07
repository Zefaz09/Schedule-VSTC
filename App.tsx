import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from 'react-native';

import { viewSchedule } from './parse';

const App = () => {
  const colorScheme = useColorScheme();
  const [schedule, setSchedule] = useState<string[][] | null>(null);

  const [loadingSchedule, setLoadingSchedule] = useState(true);

  const { width } = Dimensions.get('window');

  const timeSize = 0.3;
  const lessonSize = 0.45;
  const roomSize = 0.2;

  useEffect(() => {
    viewSchedule('https://www.vgtk.by/schedule/lessons/day-tomorrow.php').then((result) => {
      console.log('✅ Расписание:', result);
      setSchedule(result);
      setLoadingSchedule(false);
    }).catch((err) => {
      console.error('❌ Ошибка загрузки:', err);
      setLoadingSchedule(false);
    });
  }, []);



  if (loadingSchedule) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={[styles.heading, { fontFamily: 'SpaceMono' }]}>Загрузка расписания...</Text>
      </SafeAreaView>
    );
  }
  else if (!schedule || schedule.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.heading}>Нет данных расписания 😢</Text>
      </SafeAreaView>
    );
  } else {

    return (
      <SafeAreaView style={styles.container}>
        <Text style={[styles.heading, { fontFamily: 'SpaceMono' }]}>{schedule?.[1][0]}</Text>
        <View style={styles.table}>
          <View style={styles.row}>
            <Text style={[styles.cellBase, { width: width * timeSize }]}>Время</Text>
            <Text style={[styles.cellBase, { width: width * lessonSize }]}>Предмет</Text>
            <Text style={[styles.cellBase, { width: width * roomSize }]}>Кабинет</Text>
          </View>
  
          {schedule?.[0].map((_: any, i: number) => (
            <View style={styles.row} key={i}>
              <Text style={[styles.cellBase, { width: width * timeSize }]}>{schedule[0][i]}</Text>
              <Text style={[styles.cellBase, { width: width * lessonSize }]}>{schedule[1][i + 1]}</Text>
              <Text style={[styles.cellBase, { width: width * roomSize }]}>{schedule[2][i + 1]}</Text>
            </View>
          ))}
        </View>
      </SafeAreaView>
    );
  }


  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121524',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  table: {
    borderWidth: 1,
    borderColor: '#7a7a7aff',
  },
  row: {
    flexDirection: 'row',
    height: 30,
  },
  cellBase: {
    padding: 3,
    fontWeight: 'bold',
    borderWidth: 1,
    borderColor: '#7a7a7aff',
    color: '#b1afafff',
    textAlign: 'center',
  },
});

export default App;