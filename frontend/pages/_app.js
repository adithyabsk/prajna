import 'bootstrap/dist/css/bootstrap.min.css'

import { useEffect } from "react";

import DefaultLayout from "../components/layout/default";

function MyApp({ Component, pageProps }) {
    useEffect(() => {
        import("bootstrap/dist/js/bootstrap");
    }, []);

    const getLayout = Component.getLayout || (
        page => <DefaultLayout>{page}</DefaultLayout>
    );

    return getLayout(
        <Component {...pageProps} />
    );
}

export default MyApp;
