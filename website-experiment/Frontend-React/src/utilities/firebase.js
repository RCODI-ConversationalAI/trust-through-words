import { initializeApp } from "firebase/app";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
import { getPerformance } from "firebase/performance";
import { getAnalytics } from "firebase/analytics";
import { useEffect, useState } from "react";
import {
  getDatabase,
  ref,
  set,
  onValue,
  push,
  update,
  serverTimestamp,
} from "firebase/database";
import {
  getAuth,
  signInWithCustomToken,
  signInAnonymously,
  onAuthStateChanged,
  signOut,
  onIdTokenChanged,
  setPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import { reload } from "./helper";
import $ from "jquery";
import { isMobile } from "react-device-detect";

const firebaseConfig = {
  apiKey: "AIzaSyC1tqLQ4sMCeP9gq4gkeY3_5q6B2L9Q33s",
  authDomain: "chatbot-nu.firebaseapp.com",
  databaseURL: "https://chatbot-nu-default-rtdb.firebaseio.com",
  projectId: "chatbot-nu",
  storageBucket: "chatbot-nu.appspot.com",
  messagingSenderId: "97532321146",
  appId: "1:97532321146:web:a4b182e72674ec0cf40ac3",
  measurementId: "G-EN3YCLP9H5",
};

export const firebase = initializeApp(firebaseConfig);
export const appCheck = initializeAppCheck(firebase, {
  provider: new ReCaptchaV3Provider("6LdoQCIhAAAAAMTlfcxRjTrK7Ggmpdhz-OIqdBR1"),
  isTokenAutoRefreshEnabled: true,
});
export const perf = getPerformance(firebase);
export const analytics = getAnalytics(firebase);

export const auth = getAuth(firebase);
export const database = getDatabase(firebase);
export const setData = (path, value) => set(ref(database, path), value);

export const pushData = (path, value) => push(ref(database, path), value);

export const updateData = (path, value) => update(ref(database, path), value);

export const saveUserToDb = async (inputSonaID) => {
  setPersistence(auth, browserSessionPersistence).then(() => {
    signInAnonymously(auth);
  });
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const uid = user.uid;
      setData(`/user/${uid}/experiment`, {
        StartTime: serverTimestamp(),
        CountdownStartTime: new Date().getTime(),
        Instruction: false,
        PreSurvey: false,
        IntroToAnger: false,
        IntroToScenario: false,
        ChatBot: false,
        PostSurvey: false,
        openScenario: true,
        UserBrowserData: {
          Browser: navigator.userAgent,
          BrowserLanguage: navigator.languages,
          BrowserSize: `${window.innerWidth}x${window.innerHeight}`,
          BrowserTimezone: new Date().toString(),
          BrowserMobile: isMobile,
          BrowserURL: window.location.href,
          BrowserReferrer: document.referrer,
        },
      }).then(() => {
        saveSonaIdUid(inputSonaID, uid);
      });
    }
  });
};

export const saveSonaIdUid = async (inputSonaID, uid) => {
  await postData("https://api.legalchatbot.org/api/saveSonaIdUid", {
    sonaID: inputSonaID,
    uid: uid,
  });
  reload();
};

/* data functions */
export const useData = (path) => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();

  useEffect(() => {
    const dbRef = ref(database, path);
    return onValue(
      dbRef,
      (snapshot) => {
        const val = snapshot.val();
        setData(val);
        setLoading(false);
        setError(null);
      },
      (error) => {
        setData(null);
        setLoading(false);
        setError(error);
      }
    );
  }, [path]);

  return [data, loading, error];
};

export async function postData(url = "", data = {}) {
  const result = await $.ajax({
    type: "POST",
    url: url,
    // The key needs to match your method's input parameter (case-sensitive).
    data: JSON.stringify(data),
    contentType: "application/json; charset=utf-8",
    crossDomain: true,
    dataType: "json",
  });
  return result;
}

export function oldUserSignIn(token) {
  setPersistence(auth, browserSessionPersistence).then(() => {
    signInWithCustomToken(auth, token)
      .then(() => {
        reload();
        return;
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert("Error restarting experiment: " + errorCode + errorMessage);
        return;
      });
  });
}

export function logout() {
  signOut(auth);
}

export const useUserState = () => {
  const [user, setUser] = useState();

  useEffect(() => {
    onIdTokenChanged(getAuth(firebase), setUser);
  }, []);

  return user;
};

export const useUserData = (uid) => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();

  useEffect(() => {
    const dbRef = ref(database, `/user/${uid}/experiment`);
    return onValue(
      dbRef,
      (snapshot) => {
        const val = snapshot.val();
        setData(val);
        setLoading(false);
        setError(null);
      },
      (error) => {
        setData(null);
        setLoading(false);
        setError(error);
      }
    );
  }, [uid]);

  return [data, loading, error];
};
