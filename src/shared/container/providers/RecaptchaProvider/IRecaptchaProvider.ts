interface IGoogleRecaptchaProvider {
    verify(recaptcha_response: string, type: string): Promise<boolean>;
}

export { IGoogleRecaptchaProvider };
