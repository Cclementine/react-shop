import React, { useEffect, useState } from 'react';
import { FaCode } from "react-icons/fa";
import axios from "axios";
import { Icon, Col, Card, Row, Carousel } from 'antd';
import ImageSlider from '../../utils/ImageSlider';
import CheckBox from './Sections/CheckBox';
import RadioBox from './Sections/RadioBox';
import SearchFeature from './Sections/SearchFeature';
import { continents, price } from './Sections/Datas';

function LandingPage() {

    const [Products, setProducts] = useState([])
    const [Skip, setSkip] = useState(0)
    const [Limit, setLimit] = useState(8)
    const [PostSize, setPostSize] = useState(0)
    const [Filters, setFilters] = useState({
        continents: [],
        price: []
    })
    const [SearchTerm, setSearchTerm] = useState("")

    useEffect(() => {

        let body = {
            skip: Skip,
            limit: Limit
        }

        getProducts(body)

    }, [])

    const getProducts =(body) => {
        axios.post('/api/product/products', body)
            .then(response => {
                if (response.data.success) {
                    if (body.loadMore) {
                        setProducts([...Products, ...response.data.productInfo])
                    } else {
                        setProducts(response.data.productInfo)
                    }
                    setPostSize(response.data.postSize)
                } else {
                    alert("상품들을 불러오지 못했습니다.")
                }
            })
    }


    const loadMoreHandler = () => {

        let skip = Skip + Limit 
        let body = {
            skip: skip,
            limit: Limit,
            loadMore: true
        }
        getProducts(body)
        setSkip(skip)
    }



    const renderCards = Products.map((product, index) => {
        return <Col lg={6} md={8} xs={24} key={index}>
                <Card
                    cover={<a href={`/product/${product._id}`} ><ImageSlider images={product.images} /></a>}
                    title={product.title}
                    description={`$${product.price}`}
                >
                </Card>
            </Col>
    })


    const showFilteredResults = (filters) => {

        let body = {
            skip: 0,
            limit: Limit,
            filters: filters
        }
        getProducts(body)
        setSkip(0)
    }


    const handlePrice =(value) => {
        const data = price;
        let array = [];

        for (let key in data) {

            if(data[key]._id === parseInt(value, 10)) {
                array = data[key].array;
            }
        }
        return array;
    }

    const handleFilters = (filters, category) => {

        const newFilters = { ...Filters }

        newFilters[category] = filters

        console.log('filters', filters)

        if(category === "price") {
            let priceValues = handlePrice(filters)
            newFilters[category] = priceValues
        }
        showFilteredResults(newFilters)
        setFilters(filters)
    }

    const updateSearchTerm =(newSearchTerm) => {

        let body = {
            skip: 0,
            limit: 8,
            filter: Filters,
            searchTerm: newSearchTerm
        }

        setSkip(0)
        setSearchTerm(newSearchTerm)
        getProducts(body)

    }


    return (
        <div style={{ width: '75%', margin: '3rem auto' }}>
            
            <div style={{ textAlign: 'center' }}>
                <h2> 리액트를 배워봅시다! <Icon type="rocket" /> </h2>
            </div>

            {/* Filter */}
        <Row gutter={[16,16]}>
            <Col lg={12} xs={24}>
                {/* CheckBox */}
                <CheckBox list={continents} handleFilters = {filters => handleFilters(filters, "continents")} />
            </Col>
            <Col lg={12} xs={24}>
                {/* RadioBox */}
                <RadioBox list={price} handleFilters = {filters => handleFilters(filters, "price")} />
            </Col>
        </Row>

            {/* Search */}
            <div style={{ display:'flex', justifyContent: 'flex-end', margin: '1rem auto' }} >
                <SearchFeature
                    refreshFunction={updateSearchTerm}
                />
            </div>
            {/* Cards */}


            <Row gutter={[16, 16]} >
                {renderCards}
            </Row>

            <br />

            {PostSize >= Limit &&
                <div style={{ display: 'flex', justifyContent: 'center'}}>
                    <button onClick={loadMoreHandler}>더보기</button>
                </div>
            }

        </div>
    )
}

export default LandingPage
