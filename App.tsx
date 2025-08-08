import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TextInput,
} from 'react-native';

import { viewSchedule } from './parse';


const App = () => {
  const [schedule, setSchedule] = useState<[string[], Record<string, number>, string[]]| null>(null);

  const [loadingSchedule, setLoadingSchedule] = useState(true);

  const { width } = Dimensions.get('window');

  const timeSize = 0.3;
  const lessonSize = 0.45;
  const roomSize = 0.2;
  const [group, setGroup] = useState('');
  const [inputText, setInputText] = useState('');



  useEffect(() => {
  if (group !== '') {
    setLoadingSchedule(true);
    viewSchedule('https://www.vgtk.by/schedule/lessons/day-tomorrow.php', group)
      .then((result) => {
        console.log('✅ Расписание:', result);
        setSchedule(result);
        setLoadingSchedule(false);
      })
      .catch((err) => {
        console.error('❌ Ошибка загрузки:', err);
        setLoadingSchedule(false);
      });
  }
}, [group]); 

  
  if (group === "") {
    return (
      <SafeAreaView style={styles.container}>
        <SafeAreaView style={styles.bottomContainer}>
          <SafeAreaView style={styles.inputContainer}>
            <TextInput 
            style={styles.input} 
            placeholder='Введите название группы'
            value={inputText} 
            onChangeText={setInputText} 
            returnKeyType='done'
            onSubmitEditing={() => {
              setGroup(inputText);
              setInputText('');
            }}>
            </TextInput>
          </SafeAreaView>
        </SafeAreaView>
      </SafeAreaView>
    );
  }
  
  else if (loadingSchedule) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={[styles.heading, { fontFamily: 'SpaceMono' }]}>Загрузка расписания...</Text>
        <SafeAreaView style={styles.bottomContainer}>
          <SafeAreaView style={styles.inputContainer}>
            <TextInput 
            style={styles.input} 
            placeholder='Введите название группы'
            value={inputText} 
            onChangeText={setInputText} 
            returnKeyType='done'
            onSubmitEditing={() => {
              setGroup(inputText);
              setInputText('');
            }}>
            </TextInput>
          </SafeAreaView>
        </SafeAreaView>
      </SafeAreaView>
    );
  }
  else if (!schedule) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.heading}>Нет данных расписания 😢</Text>
        <SafeAreaView style={styles.bottomContainer}>
          <SafeAreaView style={styles.inputContainer}>
            <TextInput 
            style={styles.input} 
            placeholder='Введите название группы'
            value={inputText} 
            onChangeText={setInputText} 
            returnKeyType='done'
            onSubmitEditing={() => {
              setGroup(inputText);
              setInputText('');
            }}>
            </TextInput>
          </SafeAreaView>
        </SafeAreaView>
      </SafeAreaView>
    );
  } else {
    const lessonEntries = Object.entries(schedule[1]);
    return (
      <SafeAreaView style={styles.container}>
        <Text style={[styles.heading, { fontFamily: 'SpaceMono' }]}>{schedule?.[1][0]}</Text>
        <View style={styles.table}>
          <View style={styles.row}>
            <Text style={[styles.cellBase, { width: width * timeSize }]}>Время</Text>
            <Text style={[styles.cellBase, { width: width * lessonSize }]}>Предмет</Text>
            <Text style={[styles.cellBase, { width: width * roomSize }]}>Кабинет</Text>
          </View>
  
          {schedule[0].map((time, i) => {
          const lessonName = lessonEntries[i + 1]?.[0];
          const room = schedule[2][i + 1];
          

          return (
            <View style={styles.row} key={i}>
              <Text style={[styles.cellBase, { width: width * timeSize }]}>{time}</Text>
              <Text style={[styles.cellBase, { width: width * lessonSize }]}>{lessonName}</Text>
              <Text style={[styles.cellBase, { width: width * roomSize }]}>{room}</Text>
            </View>
          );
        })}

        </View>
        <SafeAreaView style={styles.bottomContainer}>
          <SafeAreaView style={styles.inputContainer}>
            <TextInput 
            style={styles.input} 
            placeholder='Введите название группы'
            value={inputText} 
            onChangeText={setInputText} 
            returnKeyType='done'
            onSubmitEditing={() => {
              setGroup(inputText);
              setInputText('');
            }}>
            </TextInput>
          </SafeAreaView>
        </SafeAreaView>
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
  bottomContainer: {
    flex: 0,
    backgroundColor: '#406a5bff',
    position: 'absolute',
    right: 0,
    left: 0,
    bottom: 0,
    height: 60,
    borderRadius: 20,
  },
  inputContainer: {
    flex: 0,
    justifyContent: 'center',
    backgroundColor: '#020a06ff',
    position: 'absolute',
    right: 10,
    left: 10,
    bottom: 5,
    top: 5,
    borderRadius: 30,
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
    height: 360,
  },
  row: {
    flexDirection: 'row',
    height: 30,
  },
  cellBase: {
    padding: 3,
    fontWeight: 'bold',
    borderWidth: 2,
    borderColor: '#7a7a7aff',
    color: '#b1afafff',
    textAlign: 'center',
    height: 30,
  },
  input: {
    color: '#ffffff',
    fontSize: 14,
    padding: 10,
    height: 40,
    width: 250,
  },
});

export default App;