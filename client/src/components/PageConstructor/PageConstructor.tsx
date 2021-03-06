import { observer } from "mobx-react-lite";
import { FC } from "react";
import { CallPage, ConnectPage, LoginPage, MainPage, RegistrationPage } from "../../pages";
import { PageStep } from "./types";

type Props = {
  step: PageStep
}

const PageConstructor: FC<Props> = ({step}) => {

  const stepsConfiguration = {
    base: {
      component: <MainPage />,
    },
    login: {
      component: <LoginPage />,
    },
    registration: {
      component: <RegistrationPage />,
    },
    connect: {
      component: <ConnectPage />,
    },
    call: {
      component: <CallPage />,
    },
  };

  return stepsConfiguration[`${step}`].component
}

export default observer(PageConstructor); 