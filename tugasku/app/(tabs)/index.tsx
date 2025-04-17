import { View, Text, TextInput, TouchableOpacity, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import tw from 'twrnc'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry'
import { AntDesign, FontAwesome5, FontAwesome6, Ionicons } from '@expo/vector-icons'

const index = () => {
    const [task, setTask] = useState('')
    const [list, setList] = useState([])
    const [isEditing, setisEditing] = useState(false)
    const [editId, setEditId] = useState('')
    const [checkbox, setCheckbox] = useState(false)

    useEffect(() => {
        loadTasks()
    },[])

    useEffect(() => {
        saveTask()
    }, [list])

    //loadtasks adalah fungsi untuk mengambil data dari asyncstorage dan di tampilkan UI, jika tidak ada ini maka pada saat aplikasi di jalankan data akan hilang dari UI tetapi data tetap ada di AsyncStorage
    const loadTasks = async () => {
            const tasks = await AsyncStorage.getItem('tasks')
            if (tasks !== null) {
                setList(JSON.parse(tasks))
            }
    }

    //saveTask adalah fungsi untuk menyimpan data tugas ke dalam AsyncStorage ibaratnya kotak tugas(3)
    const saveTask = async () => {
            await AsyncStorage.setItem('tasks', JSON.stringify(list))
    }


    //jika tugas sudah terisi maka akan masuk ke $newTask dan di set ke list, di dalam list ada semua data tugas ibaratnya semua tugas jadi satu(2)
    const addTask = () => {
        if (task.trim() === "")return ;
        const  newTask = {
            id: Date.now().toString(),
            task: task.trim(),
            checkbox: false
        }
        setList([...list, newTask]as never )
        setTask('')
    }

    const deleteTask = (id: string) => {
        const filtered = list.filter(item => item.id !== id)
        setList(filtered)
    }

    const editTask = () => {
        const updated = list.map(item => item.id === editId? {...item, task: task.trim()}: item);
        setList(updated);
        setTask('');
        setisEditing(false);
        setEditId(null);
    }

    const startEdit = (item: any) => {
        setTask(item.task);
        setisEditing(true);
        setEditId(item.id);
    }

    const handleCheckbox = (id: string) => {
        const updated = list.map(item => item.id === id ? {...item, checkbox: !item.checkbox} : item);
        setList(updated);
    }

    return (
        <SafeAreaView style={tw`p-4`}>
            <Text style={tw`text-2xl font-bold mb-2`}>nGoPoYo</Text>
            <View style={tw`justify-between items-center`}>
                <View style={tw`flex-row items-center`}>
                    <TextInput
                        style={tw`bg-gray-200 rounded-lg px-4 py-3 mr-2 w-70`}
                        placeholder="Mau ngapain hari ini?"
                        placeholderTextColor="gray"
                        value={task}
                        onChangeText={setTask}
                    />
                    <TouchableOpacity style={tw`bg-blue-800 px-4 py-2 rounded-lg`} onPress={isEditing ? editTask : addTask}>
                        <AntDesign name="plus" size={24} color="white"></AntDesign>
                    </TouchableOpacity>
                </View>
            </View>
            <Text style={tw`font-bold text-gray-500 mt-2`}>To Do</Text>
            <FlatList
                keyExtractor={(item) => item.id}
                data={list}
                renderItem={({item}) =>
                    <View style={tw`flex-row justify-between items-center p-2 mt-3 rounded-lg bg-gray-300 shadow-lg`}>

                        <View style={tw`flex-row gap-2`}>
                            <TouchableOpacity onPress={() => handleCheckbox(item.id)}>
                                <Ionicons name={item.checkbox ? "checkbox" : "square-outline"} size={24} color={item.checkbox ? "green" : "gray"} />
                            </TouchableOpacity>
                            <Text style={tw`text-gray-600`}>{item.task}</Text>
                        </View>
                        <View style={tw`flex-row gap-2`}>
                            <TouchableOpacity onPress={() => startEdit(item)}>
                                <View style={tw`bg-blue-800 p-2 rounded-md`}>
                                <FontAwesome5 name="pen" size={19} color="#fff" ></FontAwesome5>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => deleteTask(item.id)}>
                                <View style={tw`bg-red-800 p-2 rounded-md`}>
                                <FontAwesome6 name="trash" size={19} color="#fff" ></FontAwesome6>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                }

            />
        </SafeAreaView>
    )
}

export default index