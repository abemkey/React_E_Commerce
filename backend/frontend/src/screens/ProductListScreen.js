import React, { useState, useEffect } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { useNavigate ,useLocation} from "react-router-dom";
import { Table, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Paginate from '../components/Paginate'
import { listProducts, deleteProduct , createProduct} from "../actions/productActions";
import { PRODUCT_CREATE_RESET } from '../constants/productConstants'

function ProductListScreen() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const productList = useSelector((state) => state.productList);
  const { loading, error, products,pages, page  } = productList;

  const productDelete = useSelector((state) => state.productDelete);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = productDelete;

  const productCreate = useSelector(state => state.productCreate)
    const { 
        loading: loadingCreate, 
        error: errorCreate, 
        success: successCreate, 
        product: createdProduct } = productCreate

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const keyword = new URLSearchParams(location.search).get('keyword') || '';
  const pageNumber = new URLSearchParams(location.search).get('page') || 1;
  
  useEffect(() => {

    dispatch({ type: PRODUCT_CREATE_RESET })

    if (!userInfo.isAdmin) {
        navigate("/login");
    }

    if (successCreate) {
        navigate(`/admin/product/${createdProduct._id}/edit`);
       
    } else {
        dispatch(listProducts(keyword,pageNumber))
    }
  }, [dispatch, history, userInfo, successDelete, successCreate,keyword,pageNumber]);

  const deleteHandler = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      dispatch(deleteProduct(id));
    }
  };

  const createProductHandler = () => {
    dispatch(createProduct())
}


  return (
    <div>
      <Row className="align-items-center">
        <Col>
          <h1>Products</h1>
        </Col>
        <Col className="d-flex justify-content-end">
          <Button className="my-3" onClick={createProductHandler}>
            <i className="fas fa-plus"></i> Create Product
          </Button>
        </Col>
      </Row>
      {loadingDelete && <Loader />}
      {errorDelete && <Message variant="danger">{errorDelete}</Message>}

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (

         <div>
        <Table striped bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>PRICE</th>
              <th>CATEGORY</th>
              <th>BRAND</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>{product._id}</td>
                <td>{product.name}</td>
                <td>${product.price}</td>
                <td>{product.category}</td>
                <td>{product.brand}</td>

                <td>
                  <Button
                    variant="light"
                    className="btn-sm"
                    onClick={() =>
                      navigate(`/admin/product/${product._id}/edit`)
                    } // Use navigate
                  >
                    <i className="fas fa-edit"></i>
                  </Button>

                  <Button
                    variant="danger"
                    className="btn-sm"
                    onClick={() => deleteHandler(product._id)}
                  >
                    <i className="fas fa-trash"></i>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

           <Paginate pages={pages} page={page} isAdmin={true} />

        </div>
      )}
    </div>
  );
}

export default ProductListScreen;
