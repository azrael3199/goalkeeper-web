'use client';

import i18n from '@root/i18n';
import { I18nextProvider, useTranslation } from 'react-i18next';

type ITranslatorProps = { stringToTranslate: string };

const Translator = ({ stringToTranslate }: ITranslatorProps) => {
  const { t } = useTranslation();
  return <I18nextProvider i18n={i18n}>{t(stringToTranslate)}</I18nextProvider>;
};

export default Translator;
