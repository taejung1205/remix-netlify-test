const REDIRECT_URI = `${ENV.URL}/auth/`;
// const REDIRECT_URI =  "https://newbid.netlify.app/auth/";

export function kakaoInit(): any {
  const kakao = (window as any).Kakao;
  if (!kakao.isInitialized()) {
    kakao.init(ENV.KAKAO_JS_KEY);
  }
  return kakao;
}

export function isKakaoInitialized(): boolean {
  const kakao = (window as any).Kakao;
  return kakao.isInitialized();
}

export function doKakaoLogin({ path }: { path: string }) {
  const kakao = kakaoInit();
  kakao.Auth.authorize({ redirectUri: REDIRECT_URI, state: path });
}

export function checkLoggedIn({
  trueCallback,
  falseCallback,
}: {
  trueCallback: () => void;
  falseCallback: () => void;
}) {
  const kakao = kakaoInit();
  kakao.Auth.getStatusInfo((status: any) => {
    if (status.status === "connected") {
      trueCallback();
    } else {
      falseCallback();
    }
  });
}

export async function requestTokens({ code }: { code: string }) {
  console.log("requesting token");
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  };
  await fetch(
    `https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id=${ENV.KAKAO_REST_KEY}&redirect_uri=${REDIRECT_URI}&code=${code}`,
    requestOptions
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      console.log(data.access_token);
      setKakaoAccessToken({ token: data.access_token });
    });
  console.log((window as any).Kakao);
}

export function setKakaoAccessToken({ token }: { token: string }) {
  const kakao = kakaoInit();
  kakao.Auth.setAccessToken(token);
}

export function getKakaoAccessToken() {
  const kakao = kakaoInit();
  return kakao.Auth.getAccessToken();
}

export function requestUser({
  successCallback,
}: {
  successCallback: (res: any) => void;
}) {
  const kakao = kakaoInit();
  kakao.API.request({
    url: "/v2/user/me",
    success: successCallback,
    fail: (error: any) => {
      console.error(error);
    },
  });
}

export async function checkChannel(): Promise<boolean> {
  const kakao = kakaoInit();
  try {
    const result = await kakao.API.request({
      url: "/v1/api/talk/channels",
    });

    if (result.channels !== undefined) {
      const channels = result.channels;
      for (var i = 0; i < channels.length; i++) {
        const uuid = channels[i].channel_uuid;
        const relation = channels[i].relation;
        if (uuid === "@lofaseoul") {
          if (relation === "ADDED") {
            return true;
          }
          if (relation === "BLOCKED") {
            return false;
          }
        }
      }
    }
    return false;
  } catch (error) {
    console.log(error);
    return true;
  }
}

export async function addChannel() {
  const kakao = kakaoInit();
  const isChannelAdded = await checkChannel();
  if (!isChannelAdded) {
    console.log("try adding channel");
    kakao.Channel.addChannel({
      channelPublicId: "_xexaRpb",
    });
  }
}

export function requestLogout({
  successCallback,
}: {
  successCallback: () => void;
}) {
  const kakao = kakaoInit();
  if (!kakao.Auth.getAccessToken()) {
    console.log("로그인이 되어 있지 않습니다.");
    return;
  }

  kakao.Auth.logout(successCallback);
}

export function requestUnlink({
  successCallback,
}: {
  successCallback: (res: any) => void;
}) {
  const kakao = kakaoInit();
  kakao.API.request({
    url: "/v1/user/unlink",
    success: successCallback,
    fail: (error: any) => {
      console.error(error);
    },
  });
}
