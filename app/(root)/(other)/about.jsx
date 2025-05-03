import BackButton from '@/components/BackButton';
import { ScrollView, TouchableOpacity, Text, View, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const About = () => {
  return (
    <>
      <View className='pt-14 web:pt-8 bg-primary-700 px-6 pb-6'>
        <BackButton navigateTo="/account"/>
      </View>
      <ScrollView className="h-full w-full">
        <View className='px-6' >
        
          <Text className="text-3xl font-MonaExpandedBold text-primary mb-6 pt-6 text-center">About ViraShare</Text>
          
          <Text className="font-MonaMedium text-gray-800 text-lg mb-10">
            ViraShare is a revolutionary platform that turns your social media engagement into real rewards. 
            By simply liking, sharing, and interacting online, you earn points that can be converted into 
            airtime, data, and even cash straight into your account. Whether you're a content creator, 
            influencer, or just someone who loves scrolling through social media, ViraShare makes your 
            online presence more rewarding. Start sharing, start earning!
          </Text>

          {/* Terms and Conditions */}
          <Text className="text-2xl font-MonaExpandedBold text-primary mb-4">Terms and Conditions</Text>
          
          <Text className="font-MonaExpandedSemiBold text-primary mb-2">1. Introduction</Text>
          <Text className="font-MonaMedium text-gray-800 mb-4">
            Welcome to ViraShare! By using our platform, you agree to these terms. If you do not agree, please do not use our services.
          </Text>

          <Text className="font-MonaExpandedSemiBold text-primary mb-2">2. Eligibility</Text>
          <View className="mb-4">
            <Text className="font-MonaMedium text-gray-800">• You must be at least 18 years old or have parental consent to use ViraShare.</Text>
            <Text className="font-MonaMedium text-gray-800">• Users must provide accurate and complete information when signing up.</Text>
          </View>

          <Text className="font-MonaExpandedSemiBold text-primary mb-2">3. Earning and Redemption of Points</Text>
          <View className="mb-4">
            <Text className="font-MonaMedium text-gray-800">• Points are awarded based on engagement activities like liking, sharing, and interacting on social media.</Text>
            <Text className="font-MonaMedium text-gray-800">• Points can be redeemed for airtime, data, or cash, subject to availability.</Text>
            <Text className="font-MonaMedium text-gray-800">• ViraShare reserves the right to modify the reward system at any time.</Text>
          </View>

          <Text className="font-MonaExpandedSemiBold text-primary mb-2">4. Prohibited Activities</Text>
          <View className="mb-4">
            <Text className="font-MonaMedium text-gray-800">• Using bots, fake accounts, or any fraudulent means to earn points is strictly prohibited.</Text>
            <Text className="font-MonaMedium text-gray-800">• Spamming or violating social media platform policies may lead to suspension or ban.</Text>
          </View>

          <Text className="font-MonaExpandedSemiBold text-primary mb-2">5. Account Termination</Text>
          <View className="mb-4">
            <Text className="font-MonaMedium text-gray-800">• ViraShare reserves the right to suspend or terminate accounts found in violation of these terms.</Text>
            <Text className="font-MonaMedium text-gray-800">• Any earned points may be forfeited upon termination for misconduct.</Text>
          </View>

          <Text className="font-MonaExpandedSemiBold text-primary mb-2">6. Limitation of Liability</Text>
          <View className="mb-4">
            <Text className="font-MonaMedium text-gray-800">• ViraShare is not responsible for any losses incurred due to misuse of the platform.</Text>
            <Text className="font-MonaMedium text-gray-800">• We do not guarantee continuous or error-free service.</Text>
          </View>

          <Text className="font-MonaExpandedSemiBold text-primary mb-2">7. Changes to Terms</Text>
          <Text className="font-MonaMedium text-gray-800 mb-4">
            These terms may be updated at any time. Continued use of ViraShare means you accept the new terms.
          </Text>

          <Text className="font-MonaExpandedSemiBold text-primary mb-2">8. Contact</Text>
          <TouchableOpacity 
            className="bg-secondary rounded-md p-4 mb-10" 
            onPress={() => Linking.openURL('mailto:support@virashare.io')}
          >
            <Text className="font-MonaSemiBold text-md text-center">
              support@virashare.io
            </Text>
          </TouchableOpacity>

          {/* Privacy Policy */}
          <Text className="text-2xl font-MonaExpandedBold text-primary mb-4">Privacy Policy</Text>
          
          <Text className="font-MonaExpandedSemiBold text-primary mb-2">1. Introduction</Text>
          <Text className="font-MonaMedium text-gray-800 mb-4">
            Your privacy is important to us. This policy explains how we collect, use, and protect your data.
          </Text>

          <Text className="font-MonaExpandedSemiBold text-primary mb-2">2. Information We Collect</Text>
          <View className="mb-4">
            <Text className="font-MonaMedium text-gray-800">• Personal details (name, email, phone number) during registration.</Text>
            <Text className="font-MonaMedium text-gray-800">• Social media activity related to ViraShare.</Text>
            <Text className="font-MonaMedium text-gray-800">• Device and usage data for improving user experience.</Text>
          </View>

          <Text className="font-MonaExpandedSemiBold text-primary mb-2">3. How We Use Your Information</Text>
          <View className="mb-4">
            <Text className="font-MonaMedium text-gray-800">• To track and reward engagement activities.</Text>
            <Text className="font-MonaMedium text-gray-800">• To personalize user experience and improve our platform.</Text>
            <Text className="font-MonaMedium text-gray-800">• To communicate with you regarding updates and promotions.</Text>
          </View>

          <Text className="font-MonaExpandedSemiBold text-primary mb-2">4. Data Sharing and Security</Text>
          <View className="mb-4">
            <Text className="font-MonaMedium text-gray-800">• We do not sell your data to third parties.</Text>
            <Text className="font-MonaMedium text-gray-800">• Your data is securely stored and protected against unauthorized access.</Text>
          </View>

          <Text className="font-MonaExpandedSemiBold text-primary mb-2">5. User Control</Text>
          <View className="mb-4">
            <Text className="font-MonaMedium text-gray-800">• You can update or delete your account at any time.</Text>
            <Text className="font-MonaMedium text-gray-800">• Opt-out options are available for promotional communications.</Text>
          </View>

          <Text className="font-MonaExpandedSemiBold text-primary mb-2">6. Changes to Privacy Policy</Text>
          <Text className="font-MonaMedium text-gray-800 mb-4">
            We may update this policy from time to time. Users will be notified of major changes.
          </Text>

          <Text className="font-MonaExpandedSemiBold text-primary mb-2">7. Contact</Text>
          <TouchableOpacity 
            className="bg-secondary rounded-md p-4 mb-10" 
            onPress={() => Linking.openURL('mailto:privacy@virashare.io')}
          >
            <Text className="font-MonaSemiBold text-md text-center">
              privacy@virashare.io
            </Text>
          </TouchableOpacity>

          {/* Frequently Asked Questions */}
          <Text className="text-2xl font-MonaExpandedBold text-primary mb-4">Frequently Asked Questions</Text>
          
          <View className="mb-4">
            <Text className="font-MonaExpandedSemiBold text-primary mb-1">1. What is ViraShare?</Text>
            <Text className="font-MonaMedium text-gray-800 mb-4">
              ViraShare is a platform that allows you to convert your social media activities—such as liking, sharing, and engaging with content—into points that can be redeemed for airtime, data, or cash.
            </Text>
          </View>

          <View className="mb-4">
            <Text className="font-MonaExpandedSemiBold text-primary mb-1">2. How do I earn points?</Text>
            <Text className="font-MonaMedium text-gray-800 mb-4">
              You earn points by performing social media activities like sharing posts, liking content, and referring new users. The more you engage, the more points you accumulate.
            </Text>
          </View>

          <View className="mb-4">
            <Text className="font-MonaExpandedSemiBold text-primary mb-1">3. How do I redeem my points?</Text>
            <Text className="font-MonaMedium text-gray-800 mb-4">
              Once you've accumulated enough points, you can redeem them for airtime, data, or cash through your ViraShare dashboard. Redemption options may vary based on availability.
            </Text>
          </View>

          <View className="mb-4">
            <Text className="font-MonaExpandedSemiBold text-primary mb-1">4. Is there a limit to how many points I can earn?</Text>
            <Text className="font-MonaMedium text-gray-800 mb-4">
              No, there's no limit! You can earn as many points as possible by engaging actively and referring friends.
            </Text>
          </View>

          <View className="mb-4">
            <Text className="font-MonaExpandedSemiBold text-primary mb-1">5. Can I withdraw my earnings as cash?</Text>
            <Text className="font-MonaMedium text-gray-800 mb-4">
              Yes! Once you reach the minimum withdrawal threshold, you can request a payout to your bank account or mobile wallet.
            </Text>
          </View>

          <View className="mb-4">
            <Text className="font-MonaExpandedSemiBold text-primary mb-1">6. How do referrals work?</Text>
            <Text className="font-MonaMedium text-gray-800 mb-4">
              Each user gets a unique referral link. When someone signs up using your link and starts earning points, you receive a referral bonus.
            </Text>
          </View>

          <View className="mb-4">
            <Text className="font-MonaExpandedSemiBold text-primary mb-1">7. Are there any restrictions on earning points?</Text>
            <Text className="font-MonaMedium text-gray-800 mb-4">
              Yes. Points cannot be earned using fake accounts, bots, or any fraudulent activities. Violation of this rule may lead to account suspension.
            </Text>
          </View>

          <View className="mb-4">
            <Text className="font-MonaExpandedSemiBold text-primary mb-1">8. What happens if my account is suspended?</Text>
            <Text className="font-MonaMedium text-gray-800 mb-4">
              If your account is found violating our terms (e.g., engaging in fraudulent activities), it may be suspended or permanently banned. Suspended accounts may lose their earned points.
            </Text>
          </View>

          <View className="mb-4">
            <Text className="font-MonaExpandedSemiBold text-primary mb-1">9. How do I reset my password?</Text>
            <Text className="font-MonaMedium text-gray-800 mb-4">
              If you forget your password, click on the "Forgot Password" option on the login page and follow the instructions sent to your registered email.
            </Text>
          </View>

          <View className="mb-4">
            <Text className="font-MonaExpandedSemiBold text-primary mb-1">10. Is ViraShare free to use?</Text>
            <Text className="font-MonaMedium text-gray-800 mb-4">
              Yes! ViraShare is completely free to use. You only need an active social media account to participate.
            </Text>
          </View>

          <View className="mb-10">
            <Text className="font-MonaExpandedSemiBold text-primary mb-1">11. How do I contact customer support?</Text>
            <TouchableOpacity 
              className="bg-secondary rounded-md p-4 mt-2" 
              onPress={() => Linking.openURL('mailto:support@virashare.io')}
            >
              <Text className="font-MonaSemiBold text-md text-center">
                support@virashare.io
              </Text>
            </TouchableOpacity>
          </View>
          {/* <View className='mb-10' /> */}
        </View>
      </ScrollView>
    </>
  );
};

export default About;