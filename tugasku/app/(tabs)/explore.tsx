import React, { useEffect, useState } from 'react';
import {
    View, Text, TextInput, Button, FlatList,
    Pressable, Platform, TouchableOpacity
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import tw from 'twrnc';
import { FontAwesome, FontAwesome6, Ionicons } from "@expo/vector-icons";
import { Alert } from 'react-native';

export default function App() {
    const [tasks, setTasks] = useState([]);
    const [judul, setJudul] = useState('');
    const [mapel, setMapel] = useState('');
    const [kategori, setKategori] = useState('PR');
    const [deadline, setDeadline] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        loadTasks();
    }, []);

    const saveTasks = async (newTasks) => {
        await AsyncStorage.setItem('tasks', JSON.stringify(newTasks));
        setTasks(newTasks);
    };

    const loadTasks = async () => {
        const data = await AsyncStorage.getItem('tasks');
        if (data) setTasks(JSON.parse(data));
    };

    const addOrUpdateTask = () => {
        if (judul.trim() === "" && mapel.trim() === "") {
            Alert.alert(
                "Ops",
                "please input your task",
            );
            return;

        }

        if (mapel.trim().length < 3) {
            Alert.alert("Alex Nigga 69", "Mau Inputkan")
            return;
        }

        const newTask = {
            id: editingId || Date.now().toString(),
            judul,
            mapel,
            kategori,
            deadline: deadline.toDateString(),
            checkbox: false,
        };

        let updatedTasks;
        if (editingId) {
            updatedTasks = tasks.map(t => (t.id === editingId ? newTask : t));
        } else {
            updatedTasks = [...tasks, newTask];
        }

        saveTasks(updatedTasks);
        resetForm();
    };

    const editTask = (task) => {
        setJudul(task.judul);
        setMapel(task.mapel);
        setKategori(task.kategori);
        setDeadline(new Date(task.deadline));
        setEditingId(task.id);
    };

    const deleteTask = (id) => {
        Alert.alert(
            "Konfirmasi Hapus",
            "Apakah kamu yakin ingin menghapus tugas ini?",
            [
                {
                    text: "Batal",
                    style: "cancel"
                },
                {
                    text: "Hapus",
                    onPress: async () => {
                        const filtered = tasks.filter(item => item.id !== id);
                        saveTasks(filtered);
                    },
                    style: "destructive"
                }
            ]
        );
    };


    const resetForm = () => {
        setJudul('');
        setMapel('');
        setKategori('PR');
        setDeadline(new Date());
        setEditingId(null);
    };

    const handleCheckbox = (id) => {
        const updated = tasks.map(item =>
            item.id === id ? { ...item, checkbox: !item.checkbox } : item
        );
        saveTasks(updated);
    };

    return (
        <SafeAreaView style={tw`flex-1 p-4 bg-white`}>
            <Text style={tw`text-xl font-bold mb-4`}>TugasKu</Text>

            <TextInput
                placeholder="Judul Tugas"
                value={judul}
                onChangeText={setJudul}
                style={tw`p-2 mb-4 rounded border bg-gray-300`}
            />

            <TextInput
                placeholder="Mata Pelajaran"
                value={mapel}
                onChangeText={setMapel}
                style={tw`border p-2 mb-4 rounded bg-gray-300`}
            />

            {/*<Picker*/}
            {/*    selectedValue={kategori}*/}
            {/*    onValueChange={setKategori}*/}
            {/*    style={tw`border p-2 mb-4 rounded bg-gray-300`}*/}
            {/*>*/}
            {/*    <Picker.Item label="PR" value="PR" />*/}
            {/*    <Picker.Item label="Proyek" value="Proyek" />*/}
            {/*    <Picker.Item label="Ujian" value="Ujian" />*/}
            {/*</Picker>*/}



            <View style={tw`flex-row items-center mb-4`}>
                <Pressable
                    onPress={() => setShowPicker(true)}
                    style={tw`flex-row flex-1 items-center justify-between border p-2 rounded bg-gray-300`}
                >
                    <Text>
                        {`${deadline.toDateString()}`}
                    </Text>
                </Pressable>
                <View style={tw`bg-blue-800 p-2 rounded-md ml-2`}>
                    <FontAwesome name="calendar" size={20} color="white" />
                </View>
            </View>

            {showPicker && (
                <DateTimePicker
                    value={deadline}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={(e, selectedDate) => {
                        setShowPicker(false);
                        if (selectedDate) setDeadline(selectedDate);
                    }}
                />
            )}

            <View style={tw`bg-blue-900`}>
                <Button title={editingId ? 'Update Tugas' : 'Tambah Tugas'} onPress={addOrUpdateTask} disabled={mapel.trim()===""} color="white"/>
            </View>

            <Text style={tw`text-base text-gray-600 my-2`}>
                {tasks.length > 0 ? 'ADA TUGAS UNTUKMU' : 'YEAY GADA TUGAS KAMU'}
            </Text>

            <FlatList
                data={tasks}
                keyExtractor={(item) => item.id}
                style={tw`mt-4`}
                renderItem={({ item }) => (
                    <View style={tw`bg-white rounded-lg p-4 mb-4 flex-col shadow-sm border border-gray-200`}>
                        <View style={tw`flex-row items-center`}>
                            <TouchableOpacity onPress={() => handleCheckbox(item.id)} style={tw`mr-3`}>
                                <View style={tw`w-6 h-6 rounded bg-gray-400 items-center justify-center`}>
                                    {item.checkbox && (
                                        <Ionicons name="checkmark" size={16} color="white" />
                                    )}
                                </View>
                            </TouchableOpacity>

                            <View style={tw`flex-1`}>
                                <Text style={tw`font-bold text-base text-gray-800`}>{item.judul}</Text>
                                <Text style={tw`text-gray-600`}>{item.mapel}</Text>
                                <Text style={tw`text-red-700 font-semibold mt-1`}>{item.deadline}</Text>
                            </View>

                            <View style={tw`flex-row items-center ml-2`}>
                                <TouchableOpacity onPress={() => editTask(item)} style={tw`bg-blue-900 p-2 rounded mr-2`}>
                                    <FontAwesome6 name="pen" size={14} color="white" />
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => deleteTask(item.id)} style={tw`bg-red-700 p-2 rounded`}>
                                    <FontAwesome6 name="trash" size={14} color="white" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                )}
            />

        </SafeAreaView>
    );
}
