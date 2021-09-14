


class EnvironmentReader:

    def __init__(self, path='./.env'):
        self.path = path

    def read_env(self):
        with open(self.path, 'r') as env_file:
            return env_file.readlines()


    def get(self, var):
        env_vars = self.read_env()
        for env in env_vars:
            env = env.split("=")
            if env[0] == var:
                return env[1]