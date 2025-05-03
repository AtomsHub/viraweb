import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text } from 'react-native';
import * as Burnt from 'burnt';
import { FontAwesome, FontAwesome5, FontAwesome6, MaterialCommunityIcons } from '@expo/vector-icons';

import FormField from '@/components/FormField';
import api, { retrieveData, storeData } from '@/utils/api';
import CustomButton from '@/components/CustomButton';
import Loading from '@/components/Loading';
import BackButton from '@/components/BackButton';

const SocialMedia = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [errors, setErrors] = useState({});
  
  // Social media states
  const [telegram, setTelegram] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [instagram, setInstagram] = useState('');
  const [facebook, setFacebook] = useState('');
  const [twitter, setTwitter] = useState('');
  const [youtube, setYoutube] = useState('');
  const [tiktok, setTiktok] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const userResponse = await retrieveData('userResponse');
      if (userResponse) {
        setUserData(userResponse);
        // Initialize form fields with existing data
        if (userResponse.socialMedia) {
          setTelegram(userResponse.socialMedia.telegram || '');
          setLinkedin(userResponse.socialMedia.linkedin || '');
          setInstagram(userResponse.socialMedia.instagram || '');
          setFacebook(userResponse.socialMedia.facebook || '');
          setTwitter(userResponse.socialMedia.twitter || '');
          setYoutube(userResponse.socialMedia.youtube || '');
          setTiktok(userResponse.socialMedia.tiktok || '');
        }
      }
    } catch (error) {
      console.error("Error fetching user ID:", error);
    }
  };

  const isValidUrl = (url) => {
    if (!url) return false;
    try {
      const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
      const hostParts = parsed.hostname.split('.');
      return (
        parsed.protocol.startsWith('http') &&
        hostParts.length >= 2 &&
        hostParts.every(part => part.length > 0) &&
        hostParts[hostParts.length - 1].length >= 2
      );
    } catch {
      return false;
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let hasValidNewValue = false;

    // Check all fields for validity
    const fields = [
      { name: 'telegram', value: telegram, existing: userData?.socialMedia?.telegram },
      { name: 'linkedin', value: linkedin, existing: userData?.socialMedia?.linkedin },
      { name: 'instagram', value: instagram, existing: userData?.socialMedia?.instagram },
      { name: 'facebook', value: facebook, existing: userData?.socialMedia?.facebook },
      { name: 'twitter', value: twitter, existing: userData?.socialMedia?.twitter },
      { name: 'youtube', value: youtube, existing: userData?.socialMedia?.youtube },
      { name: 'tiktok', value: tiktok, existing: userData?.socialMedia?.tiktok }
    ];

    fields.forEach(field => {
      if (field.value.length > 0 && !field.existing) {
        if (!isValidUrl(field.value)) {
          newErrors[field.name] = 'Please enter a valid URL';
        } else {
          hasValidNewValue = true;
        }
      }
    });

    setErrors(newErrors);
    setIsButtonDisabled(!hasValidNewValue || Object.keys(newErrors).length > 0);
  };

  useEffect(() => {
    validateForm();
  }, [telegram, linkedin, instagram, facebook, twitter, youtube, tiktok, userData]);

  const getProfile = async () => {
    setLoading(true);
    try {
      const response = await api.get('api/auth/profile');
      if (response.data.status === "success") {
        const profileData = response.data.data; 
        await storeData(profileData);
        // console.log(profileData);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    } finally {
      setLoading(false);
    }
  }

  const addSocialMedia = async () => {
    setLoading(true);
    try {
      const payload = {
        telegram: telegram || userData?.socialMedia?.telegram || '',
        linkedin: linkedin || userData?.socialMedia?.linkedin || '',
        instagram: instagram || userData?.socialMedia?.instagram || '',
        facebook: facebook || userData?.socialMedia?.facebook || '',
        twitter: twitter || userData?.socialMedia?.twitter || '',
        youtube: youtube || userData?.socialMedia?.youtube || '',
        tiktok: tiktok || userData?.socialMedia?.tiktok || ''
      };

      // console.log(payload)
      const response = await api.post("api/auth/update-social", payload);
      // console.log(response.data.message)
      if (response.status === 200) {
        Burnt.toast({
          title: response.data.message,
          preset: 'done',
        });
        getProfile();
        fetchData(); // Refresh data after successful update
      }
    } catch (error) {
      Burnt.toast({
        title: 'Error',
        message: 'Failed to update social media',
        preset: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

 
  return (
    <>
      <View className='pt-14 web:pt-8 bg-primary-700 px-6 pb-6'>
        <BackButton navigateTo="/account"/>
      </View>
      <ScrollView className="h-full w-full">
        <View className="px-6 pt-6">
          
          <Text className="text-3xl mb-4 font-MonaExpandedSemiBold text-primary">Social Media Handles</Text>

          <FormField 
            title="Facebook" 
            value={facebook || userData?.socialMedia?.facebook || ''}
            handleChangeText={setFacebook}
            error={errors.facebook}
            iconBrand={FontAwesome}
            iconName="facebook"
            size={18}
            editable={!userData?.socialMedia?.facebook}
            autoCapitalize="none"
            keyboardType="url"
            placeholder="https://facebook.com/username"
          />

          <FormField 
            title="Instagram" 
            value={instagram || userData?.socialMedia?.instagram || ''}
            handleChangeText={setInstagram}
            error={errors.instagram}
            iconBrand={MaterialCommunityIcons}
            iconName="instagram"
            size={18}
            editable={!userData?.socialMedia?.instagram}
            autoCapitalize="none"
            keyboardType="url"
            placeholder="https://instagram.com/username"
          />

          <FormField 
            title="Twitter" 
            value={twitter || userData?.socialMedia?.twitter || ''}
            handleChangeText={setTwitter}
            error={errors.twitter}
            iconBrand={FontAwesome}
            iconName="twitter"
            size={18}
            editable={!userData?.socialMedia?.twitter}
            autoCapitalize="none"
            keyboardType="url"
            placeholder="https://twitter.com/username"
          />

          <FormField 
            title="LinkedIn" 
            value={linkedin || userData?.socialMedia?.linkedin || ''}
            handleChangeText={setLinkedin}
            error={errors.linkedin}
            iconBrand={FontAwesome}
            iconName="linkedin"
            size={18}
            editable={!userData?.socialMedia?.linkedin}
            autoCapitalize="none"
            keyboardType="url"
            placeholder="https://linkedin.com/in/username"
          />

          <FormField 
            title="YouTube" 
            value={youtube || userData?.socialMedia?.youtube || ''}
            handleChangeText={setYoutube}
            error={errors.youtube}
            iconBrand={MaterialCommunityIcons}
            iconName="youtube"
            size={18}
            editable={!userData?.socialMedia?.youtube}
            autoCapitalize="none"
            keyboardType="url"
            placeholder="https://youtube.com/username"
          />

          <FormField 
            title="TikTok" 
            value={tiktok || userData?.socialMedia?.tiktok || ''}
            handleChangeText={setTiktok}
            error={errors.tiktok}
            iconBrand={FontAwesome6}
            iconName="tiktok"
            size={18}
            editable={!userData?.socialMedia?.tiktok}
            autoCapitalize="none"
            keyboardType="url"
            placeholder="https://tiktok.com/@username"
          />

          <FormField 
            title="Telegram" 
            value={telegram || userData?.socialMedia?.telegram || ''}
            handleChangeText={setTelegram}
            error={errors.telegram}
            iconBrand={FontAwesome5}
            iconName="telegram-plane"
            size={18}
            editable={!userData?.socialMedia?.telegram}
            autoCapitalize="none"
            keyboardType="url"
            placeholder="https://t.me/username"
          />
        </View>
      </ScrollView>

      <View className="w-full px-6 mb-5 mt-2">
        <CustomButton
          title={loading ? 'Saving...' : 'Save Changes'}
          containerStyles="bg-primary mb-4"
          textStyles="text-gray"
          onPress={addSocialMedia}
          disabled={isButtonDisabled || loading}
        />
      </View>
      {loading && <Loading />}
    </>
  );
};

export default SocialMedia;