/**
 * 회원정보 관련 액션
 */
const Login = 'member/Login' as const;
const Logout = 'member/Logout' as const;

/**
 * 회원정보 액션 생성 함수
 */
export const login = (user: User) => ({ type: Login, user })
export const logout = () => ({type:Logout})
/**
 * 타입 정의
 */
type User = {
    userId: string,
    userRole: string,
    token: string,
    isLogined: boolean
}

type LoginAction = 
    | ReturnType<typeof login>
    | ReturnType<typeof logout>

/**
 * 회원정보 초기값
 */
const initialState: User = {
    userId: '',
    userRole: '',
    token: '',
    isLogined: false
}

function member(
    state: User = initialState,
    action: LoginAction
): User {
    switch(action.type){
        case Login:
            return action.user;
        case Logout:
            return initialState;
        default :
            return state;
    }
}

export default member;