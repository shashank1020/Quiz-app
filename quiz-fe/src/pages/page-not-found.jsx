import styled from "styled-components";

const PageNotFoundPage = () => {
    return (
        <NotFoundWrapper>
            <span>404!</span>
            <h3>Page not found</h3>
        </NotFoundWrapper>
    )
}

export default PageNotFoundPage;

const NotFoundWrapper = styled.div`
  display: block;
  margin: 0 auto;
  width: 500px;
  span {
    font-weight: bolder;
    font-size: 20px;
  }
`