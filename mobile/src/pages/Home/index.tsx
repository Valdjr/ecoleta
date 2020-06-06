import React, {useEffect, useState} from 'react'
import { View, ImageBackground, Text, Image, StyleSheet } from 'react-native'
import { RectButton } from 'react-native-gesture-handler'
import { Feather as Icon } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios';

interface IBGEUFResponse {
    sigla: string;
}

interface IBGECityResponse {
    nome: string;
}

interface SelectData {
    label: string;
    value: string;
}

const Home = () => {
    const navigation = useNavigation();
    const [ufs, setUfs] = useState<SelectData[]>([]);
    const [selectedUf, setSelectedUf] = useState('0');
    const [citys, setCitys] = useState<SelectData[]>([]);
    const [selectedCIty, setSelectedCity] = useState('0');

    function handleNavigateToPoints() {
        navigation.navigate('Points', {city: selectedCIty, uf: selectedUf})
    }

    useEffect(() => {
        axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(res => {
            const ufData = res.data.map(uf => ({ label: uf.sigla, value: uf.sigla }));
            setUfs(ufData);
        });
    }, [])

    useEffect(() => {
        if (selectedUf !== '0') {
            axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`).then(res => {
                const cityData = res.data.map(city => ({ label: city.nome, value: city.nome }));
                setCitys(cityData);
            });
        }
    }, [selectedUf])

    return (
        <ImageBackground source={require('../../assets/home-background.png')} style={styles.container} imageStyle={{width:274, height: 368}}>
            <View style={styles.main}>
                <Image source={require('../../assets/logo.png')} />
                <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
                <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</Text>
            </View>
            <View style={styles.radius}>
                <RNPickerSelect
                    style={pickerSelectStyles}
                    key="uf"
                    placeholder={{ label: 'UF' }}
                    value={selectedUf}
                    onValueChange={(value) => setSelectedUf(value)}
                    items={ufs}
                />
            </View>
            <View style={styles.radius}>
                <RNPickerSelect
                    style={pickerSelectStyles}
                    key="cidade"
                    placeholder={{ label: 'Cidade' }}
                    value={selectedCIty}
                    onValueChange={(value) => setSelectedCity(value)}
                    items={citys}
                />
            </View>
            <View style={styles.footer}>
                <RectButton style={styles.button} onPress={handleNavigateToPoints}>
                    <View style={styles.buttonIcon}>
                        <Icon name="arrow-right" color="#FFF" size={24} />
                    </View>
                    <Text style={styles.buttonText}>Entrar</Text>
                </RectButton>
            </View>
        </ImageBackground>
    )
}

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        backgroundColor: '#e2e2e2',
        borderRadius: 4,
        color: '#322153',
        paddingRight: 30,
    },
    inputAndroid: {
        fontSize: 16,
        marginVertical: 8,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 0.5,
        backgroundColor: '#e2e2e2',
        borderRadius: 40,
        color: '#322153',
        paddingRight: 30,
    },
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 32,
    },

    main: {
        flex: 1,
        justifyContent: 'center',
    },

    title: {
        color: '#322153',
        fontSize: 32,
        fontFamily: 'Ubuntu_700Bold',
        maxWidth: 260,
        marginTop: 64,
    },

    description: {
        color: '#6C6C80',
        fontSize: 16,
        marginTop: 16,
        fontFamily: 'Roboto_400Regular',
        maxWidth: 260,
        lineHeight: 24,
    },

    footer: {},

    radius: {
        borderRadius: 10,
    },

    select: {
        backgroundColor: '#f0f0f5'
    },

    input: {
        height: 60,
        backgroundColor: '#FFF',
        borderRadius: 10,
        marginBottom: 8,
        paddingHorizontal: 24,
        fontSize: 16,
    },

    button: {
        backgroundColor: '#34CB79',
        height: 60,
        flexDirection: 'row',
        borderRadius: 10,
        overflow: 'hidden',
        alignItems: 'center',
        marginTop: 8,
    },

    buttonIcon: {
        height: 60,
        width: 60,
        justifyContent: 'center',
        alignItems: 'center'
    },

    buttonText: {
        flex: 1,
        justifyContent: 'center',
        textAlign: 'center',
        color: '#FFF',
        fontFamily: 'Roboto_500Medium',
        fontSize: 16,
    }
});

export default Home