import React, { useState } from 'react';
import { View, StyleSheet, Image, FlatList } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import PoppinsText from '../../components/electrons/customFonts/PoppinsText';
import SelectLanguageBox from '../../components/molecules/SelectLanguageBox';
import { useTranslation } from 'react-i18next'; // Import useTranslation
import { useSelector } from 'react-redux';
import { BaseUrlImages } from '../../utils/BaseUrlImages';
import i18n from './i18n';
import { useNavigation } from '@react-navigation/native';

const SelectLanguage = (params) => {
  const { t } = useTranslation(); // Destructure t and i18n directly

  // console.log("i18n", i18n);
  const languages = useSelector(state=>state.appLanguage.languages)
  console.log("languages118", languages, params)
  const ternaryThemeColor = useSelector(
    state => state.apptheme.ternaryThemeColor,
  )
    ? useSelector(state => state.apptheme.ternaryThemeColor)
    : '#FFB533';

    const isFromProfile = params?.route?.params?.from == "profile"
    console.log("isFromi18", isFromProfile)

    const navigation = useNavigation()

  const icon = useSelector(state => state.apptheme.icon)
    ? useSelector(state => state.apptheme.icon)
    : require('../../../assets/images/demoIcon.png');

  const [language, setLanguage] = useState('');

  const setSelectedLanguage = (language) => {
    console.log("language", language);
    setLanguage(language);
    const lang = language.toLowerCase()
    // Assuming 'english' and 'arabic' are the keys used in your translation files
    i18n.changeLanguage(lang === 'english' ? 'en' : lang === "hindi" ? 'ar' : lang === "tamil" ? "tm" : lang === "telugu" ? "tl" : 'en'); // Corrected the logic for Tamil and Telugu
    if(isFromProfile){
    navigation.navigate('Splash');
    }
    else{
      navigation.navigate('SelectUser');

    }
  };


  return (
    <LinearGradient colors={['#ddd', '#fff']} style={{ flex: 1, backgroundColor: ternaryThemeColor }}>
      <View style={[styles.logoContainer]}>
        <Image
          style={{
            height: 100,
            width: 300,
            resizeMode: 'contain'
          }}
          source={{ uri: BaseUrlImages + icon }}></Image>
      </View>
      <View style={styles.textContainer}>
        <PoppinsText style={styles.title} content={t('Choose')} />
        <PoppinsText style={styles.subtitle} content={t('Your Language')} />
      </View>
      <View style={styles.languageContainer}>
      <FlatList
        data={languages}
        renderItem={({item}) => <SelectLanguageBox
        selectedLanguage={language}
        setSelectedLanguage={() => setSelectedLanguage(item.split('-')[0])}
        languageHindi={item.split('-')[0]}
        languageEnglish={item.split('-')[1]}
        image={`https://saas-apk.s3.ap-south-1.amazonaws.com/languageImagesForLocalization/${item.split('-')[0]}.png`}
      />}
        keyExtractor={item => item.id}
      />
        {/* <SelectLanguageBox
          selectedLanguage={language}
          setSelectedLanguage={() => setSelectedLanguage('hindi')}
          languageHindi={'Hindi'}
          languageEnglish={t('हिंदी')}
          image={require('../../../assets/images/languageHindi.png')}
        />
        <SelectLanguageBox
          selectedLanguage={language}
          setSelectedLanguage={() => setSelectedLanguage('english')}
          languageHindi={t('english')}
          languageEnglish={t('english')}
          image={require('../../../assets/images/languageEnglish.png')}
        />
        <SelectLanguageBox
          selectedLanguage={language}
          setSelectedLanguage={() => setSelectedLanguage('tamil')}
          languageHindi={t('Tamil')}
          languageEnglish={t('தமிழ்')}
          image={require('../../../assets/images/tamilLanguage.png')}
        />
            <SelectLanguageBox
          selectedLanguage={language}
          setSelectedLanguage={() => setSelectedLanguage('telugu')}
          languageHindi={t('Telugu')}
          languageEnglish={t('தெலுங்கு')}
          image={require('../../../assets/images/teluguLanguage.png')}
        /> */}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  logoContainer: {
    flex: 1,
    alignItems: 'center',
    // justifyContent: 'center',
    marginTop: 70
  },
  logo: {
    height: 200,
    width: 240,
    resizeMode: 'contain',
  },
  textContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  title: {
    color: 'black',
    fontSize: 28,
  },
  subtitle: {
    color: 'black',
    fontSize: 28,
    // marginTop: 8,
  },
  languageContainer: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
});

export default SelectLanguage;
