import Head from 'next/head';
import { useEffect, useState } from 'react';
import { Confirm } from 'notiflix';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

import styles from './styles.module.scss';

import { setupAPIClient } from '../../services/api';
import { Button } from 'react-bootstrap';
import { Link } from '../../components/Link';
import { withSSRAuth } from '../../utils/withSSRAuth';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { api } from '../../services/apiClient';
import { constants } from '../../utils/constants';
import { useRouter } from 'next/router';

type Page = {
    id: string;
    title: string;
    description: string;
    url: string;
    updatedAt: string;
}

interface Link {
    title: string;
    url: string;
    updatedAt: string;
}

interface GetPagesProps {
    pages?: [Page];
    user?: {
        username?: string;
        name?: string;
        id?: string;
        bio?: string;
        profile_title?: string;
    };
    setPrintHeader: any;
}

export default function Pages({ pages, user, setPrintHeader }: GetPagesProps) {
    setPrintHeader(true);
    const router = useRouter();

    // use this to make sure page is loaded and draggable elements can be printed
    const [windowsReadyLoading, setwindowsReadyLoading] = useState(false);

    useEffect(() => {
        // this means page is loaded completely
        setwindowsReadyLoading(true);
    }, []);

    const [pagesState, setPages] = useState<Page[] | null>(pages);

    const handleDeletePage = async (page_id: string, page_title: string) => {
        Confirm.show(
            'Remoção de página',
            `Tem certeza que deseja remover a página "${page_title}"?`,
            'Sim',
            'Não',
            async function () {
                try {

                    const response = await api.delete('pages', {
                        data: {
                            page_id,
                        }
                    });

                    if (response.status === 204) {
                        const updatedPages = pagesState.filter((page) => {
                            if (page.id !== page_id) {
                                return page;
                            }
                        });

                        setPages(updatedPages);

                        Notify.warning('Página removida com sucesso.', constants.notiflix.notify);
                    }
                } catch (err) {
                }
            },
            function () {
            },
            {
                titleColor: '#ff1500',
                okButtonBackground: '#ff1500',
            }
        );
    }

    const handleOnDragEnd = async (result) => {
        // avoid error when element is dragged outside of the defined droppable container
        if (!result.destination) return;

        try {
            // console.log(result)

            // create a new copy of our pages array
            const items = Array.from(pagesState);
            //  use the source.index value to find our item from our new array and remove it using the splice method
            const [reorderedPages] = items.splice(result.source.index, 1);   // result is destructured, so we end up with a new object of reorderedPages that is our dragged item
            // use our destination.inddex to add that item back into the array, but at it’s new location, again using splice
            items.splice(result.destination.index, 0, reorderedPages);

            const pages_ids_orders = items.map((page, index) => {
                return {
                    id: page.id,
                    order: index,
                }
            });

            await api.patch('pages/reorder', {
                pages_ids_orders,
            });

            setPages(items);

            Notify.success('Páginas reordenadas com sucesso.', constants.notiflix.notify);
        } catch (err) {
        }
    }

    return (
        <>
            <Head>
                <title>Páginas | Lnk.App</title>
            </Head>

            <main className={styles.container}>
                <div className={`row ` + styles.pagesContainer}>
                    <div className={`col-md-12 text-center`}>
                        <h1 className="mt-4">{user?.profile_title ? user.profile_title : `Páginas de ${user?.name}`}</h1>
                        <h3>@{user?.username}</h3>
                    </div>
                    <div className={`col-md-12 mt-4`}>
                        <Link href={`/user/page/create`} className={"text-center"}>
                            <Button variant="primary" size="lg" className={`w-100 ${styles.button}`}>
                                Adicionar nova página
                            </Button>
                        </Link>
                    </div>

                    <DragDropContext onDragEnd={handleOnDragEnd}>
                        <Droppable droppableId="pagesList">
                            {(provided) => (
                                <div ref={provided.innerRef} {...provided.droppableProps} className={`col-md-12 mt-4`}>
                                    {
                                        (windowsReadyLoading && pagesState?.length) ? pagesState
                                            .map((page, index) => (
                                                <Draggable key={page.id} draggableId={page.id} index={index}>
                                                    {(provided) => (
                                                        <div className={styles.pageList} ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                            <Link href={`/user/page/${page.url}`}>
                                                                <time>{page.updatedAt}</time>
                                                                <br />
                                                                <strong>{page.title}</strong>
                                                                <p>{page.description}</p>
                                                                <p>{page.url}</p>
                                                            </Link>
                                                            <i className={styles.editIcon} onClick={() => router.push(`/user/page/${page.url}/appearance `)} >
                                                                <FaEdit />
                                                            </i>
                                                            <i className={styles.trashIcon} onClick={() => handleDeletePage(page.id, page.title)} >
                                                                <FaTrashAlt />
                                                            </i>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            )) :
                                            <h4 className="mt-4">Nenhuma página foi encontrada.</h4>
                                    }
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                </div>
            </main>
        </>
    );
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
    // quando chamar a partir do servidor, chama o setupAPIClient passando o contexto
    const apiClient = setupAPIClient(ctx);

    const response = await apiClient.get('pages', {
        params: {
            status: true,
            return_user: true,
        }
    });

    const { pages, user } = response.data;

    let pagesFormatted = [];

    pagesFormatted = pages?.map((page) => {
        const pageFormatted = {
            id: page.id,
            title: page.title,
            description: page.description,
            url: page.url,
            image: page.image,
            updatedAt: new Date(page.updated_at).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            }) + " às " + new Date(page.updated_at).getHours() + ":" + new Date(page.updated_at).getMinutes()
        }

        return pageFormatted;
    });

    return {
        props: {
            pages: pagesFormatted,
            user,
        }
    }
});