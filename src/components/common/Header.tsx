/** @jsxImportSource @emotion/react */
import React from "react";
import { Link } from "react-router-dom";
import styled from "@emotion/styled";

const HeaderContainer = styled.header`
  background-color: #111;
  padding: 20px;
  color: white;
  box-sizing: border-box;
  overflow-x: hidden;
  max-width: 100%;
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const Logo = styled.div`
  font-size: 24px;
  letter-spacing: 2px;

  img {
    width: 240px; /* 로고 크기 조절 */
  }
`;

const NavWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const Nav = styled.nav`
  display: flex;

  a {
    margin: 0 60px;
    text-decoration: none;
    color: white;
    font-size: 14px;

    &:hover {
      color: #ccc; /* 마우스를 올렸을 때 색 변경 */
    }
  }
`;

const Header: React.FC = () => {
  return (
    <HeaderContainer>
      <HeaderContent>
        <Link to="/">
          <Logo>
            <img src="/assets/LOGO.svg" alt="Logo" />
          </Logo>
        </Link>
        <NavWrapper>
          <Nav>
            <Link to="/MainPage">국가별 정보</Link>
            <Link to="/PermissionEnter">입국 및 거주 정보</Link>
            <Link to="/EmbassyPage">국가별 대사관 정보</Link>
          </Nav>
        </NavWrapper>
      </HeaderContent>
    </HeaderContainer>
  );
};

export default Header;
