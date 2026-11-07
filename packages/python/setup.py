from setuptools import setup, find_packages

setup(
    name="graviton-cli",
    version="1.0.0",
    description="Your code is the center. AI orbits it. The self-hosted, zero-trust AI coding cockpit.",
    long_description=open("README.md", encoding="utf-8").read(),
    long_description_content_type="text/markdown",
    author="Venkata Sai Yakkshit Reddy Asodi",
    author_email="yakkshit@proton.me",
    url="https://github.com/yakkshit/graviton",
    packages=find_packages(),
    include_package_data=True,
    package_data={
        "": ["bin/*"],
    },
    entry_points={
        "console_scripts": [
            "graviton=graviton_cli.__main__:main",
        ],
    },
    license="MIT",
    classifiers=[
        "Development Status :: 5 - Production/Stable",
        "Intended Audience :: Developers",
        "Programming Language :: Python :: 3",
        "Topic :: Software Development",
    ],
    python_requires=">=3.8",
)

