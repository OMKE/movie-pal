import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import { Movies } from './pages/index/Movies';
import { Random10s } from './pages/random-10s/Random10s';
import { RecommendMe } from './pages/recommend-me/RecommendMe';
import { Navbar } from './shared/Navbar/Navbar';

function App() {
    return (
        <Router>
            <div>
                <Navbar />
                <main className="bg-black min-h-screen">
                    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                        <Switch>
                            <Route exact path="/">
                                <Movies />
                            </Route>
                            <Route exact path="/recommend-me">
                                <RecommendMe />
                            </Route>
                            <Route exact path="/random-10s">
                                <Random10s />
                            </Route>
                        </Switch>
                    </div>
                </main>
            </div>
        </Router>
    );
}

export default App;
