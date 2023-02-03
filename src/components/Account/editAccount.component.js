import React from "react";
import './account.style.css';
import './editAccount.style.css';
import { useSelector, useDispatch } from "react-redux";
import { selectUser } from "../../features/user/userSlice";
import { selectAccount, setNewData, initNewData, showExtraPasswordField, changePassword, updateUserProfile, setCurrentPassword, setNewPassword, setConfirmPassword } from "../../features/account/accountSlice";
import { useEffect } from "react";
import { login } from "../../features/user/userSlice";
import { Loader } from '../Loader/loader.component';
import { selectCart } from "../../features/cart/cartSlice";


export const EditAccount = () => {
    const user = useSelector(selectUser).user;
    const state = useSelector(selectAccount);
    const cart = useSelector(selectCart);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(initNewData(user));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user])
    return(
        <>
        <h3 className="account-page__subtitle">Main information</h3>
        <div className="edit-account__fields-wrapper">
            <div className="input-wrapper">
                <input id='fullName' className={"input" + (state.validators.fullName ? '' : ' invalid')} onChange={(e) => {
                    dispatch(setNewData({element: e.target.id, value: e.target.value}))
                    if(e.target.value !== user.fullName){
                        dispatch(showExtraPasswordField(true));
                    }
                    else{
                        dispatch(showExtraPasswordField(false));
                    }
                    }} defaultValue={user.fullName} type='text'></input>
                <label className="edit-account__input-label">Full Name</label>
                {!state.validators.fullName && <p className="err-msg">Invalid name</p>}
            </div>
            <div className="input-wrapper">
                <input id='email' className={"input" + (state.validators.email && state.validators.emailInUse && state.validators.internalError ? '' : ' invalid')} onChange={(e) => {
                    dispatch(setNewData({element: e.target.id, value: e.target.value}));
                    if(e.target.value !== user.email){
                        dispatch(showExtraPasswordField(true));
                    }
                    else{
                        dispatch(showExtraPasswordField(false));
                    }
                    }} defaultValue={user.email} type='email'></input>
                <label className="input-label">Email</label>
                {!state.validators.email && <p className="err-msg">Invalid email format</p>}
                {!state.validators.emailInUse && <p className="err-msg">This email already in use</p>}
                {!state.validators.internalError && <p className="err-msg">Internal error occurred. Try again later</p>}
            </div>
            {state.showExtraPasswordField ? 
            <div className="input-wrapper">
                <input onChange={(e) => {dispatch(setNewData({element: e.target.id, value: e.target.value}))}} id='loginPassword' className={"edit-account__input" + (state.validators.loginPassword ? '' : ' invalid')} type='password' value={state.newData.password}></input>
                <label className="input-label">Password</label>
                {state.validators.loginPassword ? 
                <p className="password-label">To perform this action, please, enter the password</p>
                :
                <p className="err-msg">Password is invalid</p>
                }
            </div>
            :
            <></>
            }
            <div className="input-wrapper">
                <input id='phone' className={"input" + (state.validators.phone ? '' : ' invalid')} onChange={(e) => dispatch(setNewData({element: e.target.id, value: e.target.value}))} defaultValue={user.phone} type='tel'></input>
                <label className="input-label">Phone</label>
                {!state.validators.phone && <p className="err-msg">Invalid phone format</p>}
            </div>
            <div className="input-wrapper">
                <input id='country' className="input" onChange={(e) => dispatch(setNewData({element: e.target.id, value: e.target.value}))} defaultValue={user.country} type='text'></input>
                <label className="input-label">Country</label>
            </div>
            <div className="input-wrapper">
                <input id='city' className="input" onChange={(e) => dispatch(setNewData({element: e.target.id, value: e.target.value}))} defaultValue={user.city} type='text'></input>
                <label className="input-label">City</label>
            </div>
            <div className="input-wrapper">
                <input id='address' className="input" onChange={(e) => dispatch(setNewData({element: e.target.id, value: e.target.value}))} defaultValue={user.address} type='text'></input>
                <label className="input-label">Address</label>
            </div>
            <button onClick={async () => {
            if(state.validators.email && state.validators.fullName && state.validators.phone){
                await dispatch(updateUserProfile({
                    oldData: {
                        fullName: user.fullName,
                        email: user.email,
                        uid: user.uid,
                        loginPassword: state.newData.loginPassword,
                    },
                    newData: {
                        fullName: state.newData.fullName,
                        email: state.newData.email,
                        phone: state.newData.phone,
                        country: state.newData.country,
                        city: state.newData.city,
                        address: state.newData.address,
                    }
                }));
                dispatch(login({
                    fullName: state.newData.fullName,
                    email: state.newData.email,
                    phone: state.newData.phone,
                    country: state.newData.country,
                    city: state.newData.city,
                    address: state.newData.address,
                    uid: user.id,
                    cart: cart.cart,
                }))
            }
            }} className="orange-btn edit-account__save-btn">Save</button>
        </div>
        <h3 className="account-page__subtitle">Change password</h3>
        <div className="edit-account__fields-wrapper">
            <div className="input-wrapper">
                <input onChange={(e) => {dispatch(setCurrentPassword(e.target.value))}} id='password' className={"input" + (state.validators.password ? '' : ' invalid')} type='password' value={state.password.password}></input>
                <label className="input-label">Current password</label>
                {state.validators.password ?
                <></>
                :
                <p className="err-msg">Password is invalid</p>
                }
            </div>
            <div className="input-wrapper">
                <input onChange={(e) => {
                    dispatch(setNewPassword(e.target.value));
                    }} id='newPassword' className={"input" + (state.validators.newPassword ? '' : ' invalid')} type='password' value={state.password.newPassword}></input>
                <label className="input-label">New Password</label>
                {!state.validators.passwordEntering &&
                <p className={state.validators.newPassword ? "edit-account__password-label" : 'err-msg'}>The password has to be at least at least 1 letter, 1 special symbol, 1 number and 8 character length</p>}
            </div>
            <div className="input-wrapper">
                <input onChange={(e) => {
                    dispatch(setConfirmPassword(e.target.value))
                    }} id='confirmPassword' className={"input" + (state.validators.confirmPassword ? '' : ' invalid')} type='password' value={state.password.confirmPassword}></input>
                <label className="input-label">Confirm Password</label>
                {state.validators.confirmPassword ?
                <></>
                :
                <p className="err-msg">Passwords are not matched</p>
                }
            </div>
            <button onClick={ () => {
                if(state.validators.confirmPassword && state.validators.newPassword){
                    dispatch(changePassword({email: user.email, password: state.password.password, newPassword: state.password.newPassword}));
                }
            }} className="orange-btn edit-account__save-btn">Change password</button>
        </div>
        {state.loading ? <Loader/> : <></>}
        </>
    )
}