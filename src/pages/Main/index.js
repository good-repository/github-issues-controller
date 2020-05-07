import React, { Component } from 'react'
import { FaGithubAlt, FaPlus, FaSpinner } from 'react-icons/fa'
import { Link } from 'react-router-dom'

import api from '../../services/api'

import Container from '../../components/Container'
import { Form, SubmitButton, List } from './styles'

export default class Main extends Component {
    state = {
        newRepo: '',
        repositories: [],
        loading: false,
        error: false
    }

    //load data on local storage
    componentDidMount() {
        const repositories = localStorage.getItem('repositories')

        if (repositories) {
            this.setState({ repositories: JSON.parse(repositories) })
        }
    }

    //save data on local storage
    componentDidUpdate(_, prevState) {
        const { repositories } = this.state

        if (prevState.repositories !== repositories) {
            localStorage.setItem('repositories', JSON.stringify(repositories))
        }
    }

    handleInputChange = e => {
        this.setState({ newRepo: e.target.value })
    }
    // try {

    // } catch (error) {

    // }
    handleSubmit = async e => {
        e.preventDefault()

        this.setState({ loading: true, error: false })

        try {

            const { newRepo, repositories } = this.state

            if (newRepo === '') throw new Error('Você precisa digitar um repositório')

            const hasRepo = repositories.find(r => r.name === newRepo)

            if (hasRepo) throw new Error('Este repositório já foi adicionado')

            const response = await api.get(`/repos/${newRepo}`)

            const data = {
                name: response.data.full_name
            }

            this.setState({
                repositories: [...repositories, data],
                newRepo: '',
                loading: false
            })
        } catch (error) {
            this.setState({ error: true })
        } finally {
            this.setState({ loading: false })
        }
    }

    render() {
        const { newRepo, repositories, loading, error } = this.state

        return (
            <Container>
                <h1>
                    <FaGithubAlt />
                    Repositórios
                </h1>

                <Form onSubmit={this.handleSubmit} error={error}>
                    <input
                        type="text"
                        placeholder="Adicionar um repositório"
                        value={newRepo}
                        onChange={this.handleInputChange}
                    />

                    <SubmitButton loading={loading ? 1 : undefined}>
                        {loading ? <FaSpinner color="#FFF" size={14} /> : <FaPlus color="#FFF" size={14} />}
                    </SubmitButton>
                </Form>

                <List>
                    {repositories.map(repository => (
                        <li key={repository.name}>
                            <span>{repository.name}</span>
                            <Link to={`/repository/${encodeURIComponent(repository.name)}`} > Detalhes</Link>
                        </li>
                    ))}
                </List>
            </Container >
        )
    }
}