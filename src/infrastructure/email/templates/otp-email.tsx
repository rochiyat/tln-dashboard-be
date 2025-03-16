import * as React from "react";

import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

interface OTPEmailProps {
  otp: number;
  username?: string;
}

export const OTPEmail = ({ otp, username = "there" }: OTPEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Your verification code: {otp.toString()}</Preview>
      <Tailwind>
        <Body className="bg-gray-100 font-sans py-10">
          <Container className="max-w-md mx-auto">
            <Section className="flex justify-center items-center w-full font-sans">
              <Section className="flex flex-col items-center w-full rounded-2xl px-8 py-6 bg-white shadow-lg">
                <Text className="text-sm font-medium text-violet-500">
                  Verify your Email Address
                </Text>
                <Text className="text-gray-500 my-0">
                  Hi {username}, use the following code to verify your email
                  address
                </Text>
                <Text className="text-5xl font-bold pt-4 pb-2">{otp}</Text>
                <Text className="text-gray-400 font-light text-xs pb-4">
                  This code is valid for 10 minutes
                </Text>
                <Hr className="border-t border-gray-300 w-full my-4" />
                <Text className="text-gray-600 text-xs">
                  Thank you for joining us
                </Text>
              </Section>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

OTPEmail.PreviewProps = {
  otp: 123456,
  username: "Jane Doe",
};

export default OTPEmail;
