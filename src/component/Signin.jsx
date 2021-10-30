import React, { useState, useEffect, useContext } from 'react';
import { Box, Layer, Text, TextInput, Button, Nav, ResponsiveContext, Anchor } from 'grommet';
import { User, Phone, DocumentText, UserNew, Lock } from 'grommet-icons';
import { defaultExceptionMessage, regKorName, regPhone } from '../constant';
import { apiCall, setCookie, verifyRecaptcha } from '../common';

const Signin = (props) => {
    const { push } = useContext(props.RouterContext);
    const size = useContext(ResponsiveContext);

    const [open, setOpen] = useState(false);
    const [submitToggle, setSubmitToggle] = useState(false);
    
    const [resultMessage, setResultMessage] = useState(defaultExceptionMessage);

    const [username, setUsername] = useState();
    const [phoneNumber, setPhoneNumber] = useState();
    const [password, setPassword] = useState();

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

    const signin = async () => {
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
                onOpen();
            }
        }
        else {
            setResultMessage(defaultExceptionMessage);
            onOpen();
        }
    };

    useEffect(() => {
        setSubmitToggle(confirm())
    }, [username, phoneNumber, password]);

    return (
        <Box fill="vertical" overflow="auto" align="center" flex="grow" direction="column" justify="start" animation="fadeIn" background={{ "color": "light-2" }}>
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
                <Nav align="center" flex={false} direction="row" pad="small" justify="center" gap={size === 'small' ? '20px' : '22px'}>
                    <Button icon={<DocumentText color="dark-1" size={size === 'small' ? '20px' : '22px'} />} type="button" plain onClick={() => push('/description')} />
                    <Button icon={<UserNew color="dark-1" size={size === 'small' ? '20px' : '22px'} />} type="button" plain onClick={() => push('/signup')} />
                </Nav>
            </Box>
            <Box align="center" justify="center" direction="column" pad="48px" fill="horizontal" gap="medium" flex={false}>
            </Box>
            <Box align="center" justify="center" direction="column" pad="small" fill="horizontal" gap="medium" flex={false} background={{ "color": "dark-1" }}>
                <Text textAlign="center" size="xxlarge" color="light-2" weight="normal" style={{ fontFamily: 'Pacifico' }}>
                    Cloist.
                </Text>
            </Box>
            <Box align="center" justify="center" pad="small" fill="horizontal" flex={false}>
                <Text textAlign="center" size="20px" color="dark-1" weight="normal" style={{ fontFamily: 'Pacifico' }}>
                    Pray Together.
                </Text>
            </Box>
            <Box align="center" justify="center" direction="column" pad="medium" gap="medium" flex={false}>
                <TextInput value={username} onChange={event => setUsername(event.target.value)} size={size === 'small' ? 'xsmall' : 'small'} icon={<User size={size} />} placeholder="실명 입력" type="text" maxLength="6" focusIndicator={false} />
                <TextInput value={phoneNumber} onChange={event => setPhoneNumber(event.target.value)} size={size === 'small' ? 'xsmall' : 'small'} icon={<Phone size={size} />} placeholder="전화번호 입력" type="tel" maxLength="11" focusIndicator={false} />
                <TextInput value={password} onChange={event => setPassword(event.target.value)} size={size === 'small' ? 'xsmall' : 'small'} icon={<Lock size={size} />} placeholder="비밀번호 입력" type="password" maxLength="20" focusIndicator={false} />
                <Box align="center" justify="center" direction="column" pad="medium">
                    <Button label="로그인" color="dark-1" size="medium" onClick={() => signin()} disabled={submitToggle} type="submit" />
                </Box>
            </Box>
            <Text size="xsmall">
                This site is protected by reCAPTCHA<br />
                and the Google <Anchor href="https://policies.google.com/privacy">Privacy Policy</Anchor> and<br />
                <Anchor href="https://policies.google.com/terms">Terms of Service</Anchor> apply.
            </Text>
        </Box>
    )
}

export default Signin;