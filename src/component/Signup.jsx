import React, { useState, useEffect, useContext } from 'react';
import { Box, Layer, Text, TextInput, Button, Nav, ResponsiveContext, Anchor } from 'grommet';
import { User, Phone, Lock, Login } from 'grommet-icons';
import { defaultExceptionMessage, regKorName, regPhone } from '../constant';
import { apiCall, setCookie, verifyRecaptcha } from '../common';

const Signup = (props) => {
    const { push } = useContext(props.RouterContext);
    const size = useContext(ResponsiveContext);

    const [layer, setLayer] = useState();
    const [open, setOpen] = useState(false);
    const [submitToggle, setSubmitToggle] = useState(false);

    const [username, setUsername] = useState();
    const [phoneNumber, setPhoneNumber] = useState();
    const [password, setPassword] = useState();

    const [resultMessage, setResultMessage] = useState(defaultExceptionMessage);

    const onClose = () => setOpen(undefined);

    const onOpen = () => {
        setOpen(true);
        setTimeout(() => {
            setOpen(undefined);
        }, 3000);
    };

    const confirm = () => {
        if (username === undefined || username === '' || regKorName.test(username) === false)
            return true;

        if (phoneNumber === undefined || phoneNumber === '' || regPhone.test(phoneNumber) === false)
            return true;

        if (password === undefined || password === '')
            return true;

        return false;
    };

    const signup = async () => {
        const isVerified = await verifyRecaptcha('signup');

        if (isVerified === false)
            return;

        const response = await apiCall(
            'POST',
            `/signup?lang=ko`,
            {
                username: username,
                phoneNumber: phoneNumber,
                password: password
            },
            push
        );

        if (response) {
            if (response.success) {
                setLayer(451);
            }
            else {
                setResultMessage(response.message);
                onOpen()
            }
        }
        else {
            setResultMessage(defaultExceptionMessage);
            onOpen()
        }
    };

    const signin = async () => {
        setLayer(undefined);

        const isVerified = await verifyRecaptcha('signin');

        if (isVerified === false)
            return;

        const response = await apiCall(
            'POST',
            `/signin?lang=ko`,
            {
                username: username,
                phoneNumber: phoneNumber,
                password: password
            },
            push
        );

        if (response) {
            if (response.success) {
                setCookie('MONASTERYTOKEN', response.data);
                push('/main');
            }
            else {
                setResultMessage(response.message);
                onOpen()
            }
        }
        else {
            setResultMessage(defaultExceptionMessage);
            onOpen()
        }
    };

    useEffect(() => {
        setSubmitToggle(confirm());
    }, [username, phoneNumber, password]);

    return (
        <Box fill="vertical" overflow="auto" align="center" flex="grow" direction="column" justify="start" animation="fadeIn" background={{ "color": "light-2" }}>
            {layer === 451 && (
                <Layer plain onClickOutside={() => setLayer(layer ? undefined : 451)} position="center" responsive={false}>
                    <Box
                        align="center"
                        justify="center"
                        gap="medium"
                        pad="medium"
                        background={{ "color": "dark-1" }}
                        border={{ "color": "active" }}
                        width={size === 'small' ? '288px' : 'medium'}
                        round="small"
                        elevation="small">
                        <Text textAlign="center" size={size} weight="bold">
                            성공
                        </Text>
                        <Text textAlign="center" size={size === 'small' ? 'xsmall' : 'small'}>
                            회원 가입 완료
                        </Text>
                        <Box align="center" justify="center" direction="row" gap="small">
                            <Button label="입장" size={size === 'small' ? 'xsmall' : 'small'} color="light-2" onClick={() => signin()} />
                        </Box>
                    </Box>
                </Layer>
            )}
            {open && (
                <Layer position="bottom" modal={false} margin={{ bottom: 'medium' }} responsive={false} onClickOutside={() => onClose()} plain>
                    <Box align="center"
                        gap="small"
                        justify="center"
                        round="small"
                        pad="medium"
                        width={size === 'small' ? '288px' : 'medium'}
                        background="status-error">
                        <Text size="xsmall">
                            {resultMessage}
                        </Text>
                    </Box>
                </Layer>
            )}
            <Box align="center" justify="between" flex={false} direction="row" pad="medium" fill="horizontal">
                <Box align="center" justify="center" direction="row" pad="small">
                    <Text textAlign="center" color="dark-1" size={size === 'small' ? 'medium' : 'large'} style={{ fontFamily: 'Pacifico' }}>
                        Cloist.
                    </Text>
                </Box>
                <Nav align="center" flex={false} direction="row" pad="small" gap={size === 'small' ? '20px' : '22px'} justify="center">
                    <Button icon={<Login size={size === 'small' ? '20px' : '22px'} color="dark-1" />} type="button" plain onClick={() => push('/signin')} />
                </Nav>
            </Box>
            <Box align="center" justify="center" direction="column" pad="medium" flex={false} fill="horizontal" gap="medium">
                <Box align="center" justify="center" direction="column" gap="small">
                    <Text textAlign="center" weight="bold" size={size === 'small' ? 'medium' : 'large'}>
                        가입
                    </Text>
                    <Text textAlign="center" weight="normal" size={size === 'small' ? 'xsmall' : 'small'}>
                        서비스 가입을 위한 회원 정보 입력
                    </Text>
                </Box>
                <Box align="center" justify="center" direction="column" pad="medium" gap="medium" flex={false}>
                    <TextInput value={username} onChange={event => setUsername(event.target.value)} icon={<User size={size} />} size={size === 'small' ? 'xsmall' : 'small'} placeholder="실명 입력" type="text" maxLength="6" focusIndicator={false} />
                    <TextInput value={phoneNumber} onChange={event => setPhoneNumber(event.target.value)} icon={<Phone size={size} />} size={size === 'small' ? 'xsmall' : 'small'} placeholder="전화번호 입력" type="tel" maxLength="11" focusIndicator={false} />
                    <TextInput value={password} onChange={event => setPassword(event.target.value)} icon={<Lock size={size} />} size={size === 'small' ? 'xsmall' : 'small'} placeholder="비밀번호 입력" type="password" maxLength="20" focusIndicator={false} />
                </Box>
                <Box align="center" justify="center" direction="column">
                    <Button label="제출" color="dark-1" size="medium" onClick={() => signup()} disabled={submitToggle} />
                </Box>
                <Box align="center" justify="between" flex={false} direction="row" fill="horizontal" />
                <Text size="xsmall">
                    This site is protected by reCAPTCHA<br />
                    and the Google <Anchor href="https://policies.google.com/privacy">Privacy Policy</Anchor> and<br />
                    <Anchor href="https://policies.google.com/terms">Terms of Service</Anchor> apply.
                </Text>
            </Box>
        </Box>
    )
}

export default Signup;