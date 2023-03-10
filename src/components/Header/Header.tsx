import React, {useState} from 'react';
import './Header.scss'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import {useActions} from "../../hooks/actions";
import {useAppSelector} from "../../hooks/redux";
import {Link} from "react-router-dom";
import DialogLogin from "../DialogLogin/DialogLogin";
import DialogRegister from "../DialogRegister/DialogRegister";
import {ReactComponent as BasketIcon} from "../../assets/img/basket.svg"
import DialogBasket from "../DialogBasket/DialogBasket";
import {IProductInfo} from "../../models/Interfaces";
import {Badge} from "@mui/material";
import SuccessSnackBar from "../SuccessSnackBar/SuccessSnackBar";

const Header = () => {
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [openLogin, setOpenLogin] = useState(false)
  const [openRegister, setOpenRegister] = useState(false);
  const {logoutUser} = useActions()
  const user = useAppSelector((state) => state.auth.user);
  const {openBasket} = useActions()
  const [openAlertSuccess, setOpenAlertSuccess] = useState(false);

  const handleOpenUserMenu = ({event}: { event: any }) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleLogout = (event: React.MouseEvent<HTMLAnchorElement> | React.MouseEvent<HTMLLIElement>) => {
    event.preventDefault()
    logoutUser({})
    setAnchorElUser(null);
  };

  let badgeContentValue = user?.basket?.reduce((sum: number, elem: IProductInfo) => sum + elem.col, 0) || 0

  return (
    <header className='header'>
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Link className='logo' to="/">Shop</Link>

            {user.email
              ? (
                <Box sx={{flexGrow: 1, display: {xs: 'none', md: 'flex', alignItems: 'center', gap: 10}}}>

                  {user?.role === 'admin' && (
                    <MenuItem>
                      <Link className="typography__link" to='/admin'>
                        <Typography className="typography" textAlign="center">
                          Admin
                        </Typography>
                      </Link>
                    </MenuItem>
                  )}

                  <Tooltip title="Open settings">
                    <IconButton onClick={(event) => handleOpenUserMenu({event: event})} sx={{p: 0}}>
                      <Avatar alt={user.name} src={String(user.avatar)}/>
                    </IconButton>
                  </Tooltip>

                  <Menu
                    sx={{mt: '45px'}}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={() => setAnchorElUser(null)}
                  >
                    <MenuItem>
                      <Link className='header__link' to={`/users/${user.id}`}>
                        <Typography textAlign="center">{user.name} profile</Typography>
                      </Link>
                    </MenuItem>

                    <MenuItem onClick={(event) => handleLogout(event)}>
                      <Typography textAlign="center">Logout</Typography>
                    </MenuItem>
                  </Menu>
                </Box>
              )
              : <Box sx={{flexGrow: 1, display: {xs: 'none', md: 'flex'}}}>
                <MenuItem onClick={() => setOpenRegister(true)}>
                  <Typography className='typography' textAlign="center">Register</Typography>
                </MenuItem>
                <MenuItem onClick={() => setOpenLogin(true)}>
                  <Typography className='typography' textAlign="center">Login</Typography>
                </MenuItem>

                <DialogLogin
                  openLogin={openLogin}
                  setOpenLogin={setOpenLogin}
                  setOpenAlertSuccess={setOpenAlertSuccess}
                />
                <DialogRegister
                  openRegister={openRegister}
                  setOpenRegister={setOpenRegister}
                />
              </Box>
            }

            <Box className="header__basketBox" onClick={() => openBasket(true)}>
              <Badge invisible={badgeContentValue<=0} badgeContent={badgeContentValue} color="success">
                <BasketIcon/>
              </Badge>
            </Box>
            <DialogBasket setOpenAlertSuccess={setOpenAlertSuccess}/>

          </Toolbar>
        </Container>
      </AppBar>

      <SuccessSnackBar
          openAlertSuccess={openAlertSuccess}
          setOpenAlertSuccess={setOpenAlertSuccess}
          title='Congratulations'
          text='You entered the correct login.'
      />

      <SuccessSnackBar
          openAlertSuccess={openAlertSuccess}
          setOpenAlertSuccess={setOpenAlertSuccess}
          title='Order successful'
          text='Thank you so much for your order.'
      />

    </header>
  );
};

export default Header;